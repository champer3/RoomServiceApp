import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  InteractionManager,
  Keyboard,
  LayoutAnimation,
  UIManager,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import Text from "../../components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import ProductCategory from "../../components/Category/ProductCategory";
import ItemCategory from "../../components/Category/ItemCategory";
import Item from "../../components/Item/Item";
import { useSelector } from "react-redux";
import { selectTotalCartCount } from "../../Data/cart";
import { SERVER_URL } from "../../config";
import { fetchAppHome, fetchAppDepartment, invalidateAppCache } from "../../api/appPromotions";
import SkeletonBrowse from "../../components/SkeletonBrowse";
import { getSocket } from "../../socketService";
import { useTheme } from "../../theme/ThemeContext";

const H_PAD = 18;
const TAB_BAR_BOTTOM_PAD = 140;
/** Match DepartmentScreen search glass */
const BROWSE_SEARCH_RADIUS = 15;
const BROWSE_SEARCH_BAR_ROTATION_MS = 4600;

const PLACEHOLDER_IMAGE = require("../../assets/food.png");

const TRENDING_TERMS = ["Chips", "Ice cream", "Milk", "Water", "Coffee", "Cookies"];

const BrowseSectionAnimated = React.memo(({ index, children, style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

const BrowseItemAnimated = React.memo(({ index, children, style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 100 + index * 60,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

/** @param {string | undefined | null} url */
function mediaUri(url) {
  const u = String(url || "").trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  const base = String(SERVER_URL || "").replace(/\/$/, "");
  if (!base) return u.startsWith("/") ? u : `/${u}`;
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

/** @param {{ imageUrl?: string, iconUrl?: string }} cat */
function categoryImageSource(cat) {
  const uri = mediaUri(cat.imageUrl || cat.iconUrl);
  return uri ? { uri } : PLACEHOLDER_IMAGE;
}

function searchTitles(items, searchPhrase) {
  const phrase = String(searchPhrase || "").toLowerCase().trim();
  if (!phrase) return [];
  const result = [];
  const seen = new Set();

  items.forEach((item) => {
    const push = () => {
      const id = item.id ?? item.title;
      if (seen.has(id)) return;
      seen.add(id);
      result.push(item);
    };

    if (item.title && item.title.toLowerCase().includes(phrase)) {
      push();
      return;
    }
    if (item.related) {
      item.related.forEach((keyword) => {
        if (String(keyword).toLowerCase().includes(phrase)) push();
      });
    }
    if (item.subCategory) {
      item.subCategory.forEach((keyword) => {
        if (String(keyword).toLowerCase().includes(phrase)) push();
      });
    }
    if (item.nutrients) {
      item.nutrients.forEach((keyword) => {
        if (keyword.name && String(keyword.name).toLowerCase().includes(phrase)) push();
      });
    }
    if (item.components) {
      item.components.forEach((keyword) => {
        if (String(keyword).toLowerCase().includes(phrase)) push();
      });
    }
  });

  return result;
}

export default function CategoryAll() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const cartItems = useSelector((state) => state.cartItems.ids);
  const productItems = useSelector((state) => state.productItems.ids);
  const [value, setValue] = useState("");
  const searchInputRef = useRef(null);
  const wasSearchingRef = useRef(false);

  const setSearchValue = useCallback((v) => {
    const willSearch = v.length > 0;
    const wasSearching = wasSearchingRef.current;
    if (willSearch !== wasSearching) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(250, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
      );
    }
    wasSearchingRef.current = willSearch;
    if (!willSearch && wasSearching) {
      Keyboard.dismiss();
    }
    setValue(v);
  }, []);

  const [browseStatus, setBrowseStatus] = useState("loading");
  const [browseError, setBrowseError] = useState(null);
  /** @type {[{ department: { id?: string, name: string, slug: string, iconUrl?: string }, categories: Array<{ id: string, name: string, slug: string, iconUrl?: string, imageUrl?: string }> }]} */
  const [departmentBrowse, setDepartmentBrowse] = useState([]);
  const [browseLoadKey, setBrowseLoadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setBrowseStatus("loading");
    setBrowseError(null);

    const handle = InteractionManager.runAfterInteractions(() => {
      fetchAppHome()
        .then(async (home) => {
          if (cancelled) return;
          const depts = Array.isArray(home?.departments) ? home.departments : [];
          const rows = await Promise.all(
            depts.map(async (d) => {
              const slug = d?.slug ? String(d.slug).trim() : "";
              if (!slug) {
                return {
                  department: {
                    id: d?.id,
                    name: d?.name || "Department",
                    slug: "",
                    iconUrl: d?.iconUrl,
                  },
                  categories: [],
                };
              }
              try {
                const data = await fetchAppDepartment(slug);
                if (cancelled) return null;
                return {
                  department: {
                    id: d?.id,
                    name: data?.department?.name || d?.name || "Department",
                    slug: data?.department?.slug || slug,
                    iconUrl: data?.department?.iconUrl ?? d?.iconUrl,
                  },
                  categories: Array.isArray(data?.categories) ? data.categories : [],
                };
              } catch {
                if (cancelled) return null;
                return {
                  department: {
                    id: d?.id,
                    name: d?.name || "Department",
                    slug,
                    iconUrl: d?.iconUrl,
                  },
                  categories: [],
                };
              }
            })
          );
          if (cancelled) return;
          setDepartmentBrowse(rows.filter(Boolean));
          setBrowseStatus("ready");
        })
        .catch((e) => {
          if (cancelled) return;
          setBrowseError(e?.message || "Could not load categories");
          setBrowseStatus("error");
        });
    });

    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [browseLoadKey]);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;
    const handleRefresh = () => {
      invalidateAppCache();
      setBrowseLoadKey((k) => k + 1);
    };
    s.on('categoryUpdate', handleRefresh);
    s.on('departmentUpdate', handleRefresh);
    return () => {
      s.off('categoryUpdate', handleRefresh);
      s.off('departmentUpdate', handleRefresh);
    };
  }, []);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (browseStatus === 'ready' && !hasRevealed) {
      setHasRevealed(true);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [browseStatus, hasRevealed, contentOpacity]);

  const cartCount = useSelector(selectTotalCartCount);

  const browseSearchPhrases = useMemo(() => {
    const names = departmentBrowse
      .map((r) => String(r.department?.name || "").trim())
      .filter(Boolean);
    if (names.length >= 2) {
      return [
        { lead: `Search ${names[0]}, ${names[1]}…` },
        { lead: "Browse every department in one place" },
      ];
    }
    if (names.length === 1) {
      return [
        { lead: `Search ${names[0]} and more` },
        { lead: "Find groceries, snacks, drinks…" },
      ];
    }
    return [
      { lead: "Search groceries, snacks, and more" },
      { lead: "Find what you need quickly" },
    ];
  }, [departmentBrowse]);

  const [browseSearchFocused, setBrowseSearchFocused] = useState(false);
  const [browseSearchPhraseIndex, setBrowseSearchPhraseIndex] = useState(0);
  const browseSearchTextOpacity = useRef(new Animated.Value(1)).current;
  const browseSearchTextTranslateY = useRef(new Animated.Value(0)).current;

  const browsePhraseLen = Math.max(browseSearchPhrases.length, 1);
  const activeBrowseSearchLead =
    browseSearchPhrases[browseSearchPhraseIndex % browsePhraseLen]?.lead ||
    "Search groceries, snacks, and more";

  useEffect(() => {
    setBrowseSearchPhraseIndex(0);
    browseSearchTextOpacity.setValue(1);
    browseSearchTextTranslateY.setValue(0);
  }, [browseSearchPhrases, browseSearchTextOpacity, browseSearchTextTranslateY]);

  useEffect(() => {
    const len = browseSearchPhrases.length;
    if (len <= 1 || value.length > 0) return undefined;

    let cancelled = false;
    const advance = () => {
      if (cancelled) return;
      Animated.parallel([
        Animated.timing(browseSearchTextOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(browseSearchTextTranslateY, {
          toValue: -6,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;
        setBrowseSearchPhraseIndex((i) => (i + 1) % len);
        browseSearchTextTranslateY.setValue(7);
        Animated.parallel([
          Animated.timing(browseSearchTextOpacity, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(browseSearchTextTranslateY, {
            toValue: 0,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    const id = setInterval(advance, BROWSE_SEARCH_BAR_ROTATION_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [browseSearchPhrases.length, value.length, browseSearchTextOpacity, browseSearchTextTranslateY]);

  const quickPickEntries = useMemo(() => {
    const out = [];
    const seen = new Set();
    for (const row of departmentBrowse) {
      const slug = row.department?.slug;
      if (!slug) continue;
      for (const c of row.categories) {
        const key = c.slug || c.id || c.name;
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push({ category: c, department: row.department });
        if (out.length >= 8) return out;
      }
    }
    return out;
  }, [departmentBrowse]);

  const quickPicksDisplay = quickPickEntries.slice(0, 4);

  const searchResults = useMemo(() => searchTitles(productItems, value), [productItems, value]);

  const bottomPad = Math.max(insets.bottom, 12) + TAB_BAR_BOTTOM_PAD;

  const openCategorySearch = useCallback(
    (categoryName, departmentSlug, departmentName, meta = {}) => {
      navigation.navigate("CategorySearch", {
        cat: categoryName,
        categorySlug: meta.slug ? String(meta.slug).toLowerCase().trim() : undefined,
        imageUrl: meta.imageUrl || undefined,
        iconUrl: meta.iconUrl || undefined,
        departmentSlug: departmentSlug || undefined,
        departmentName: departmentName || undefined,
      });
    },
    [navigation]
  );

  const isSearching = value.length > 0;

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {!isSearching && (
          <View style={styles.headerBlock}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Browse</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Find what you need quickly</Text>
          </View>
        )}

        <View style={[styles.browseSearchWrap, isSearching && styles.browseSearchWrapActive]}>
          <View style={styles.deptSearchBackdrop}>
            <View style={styles.deptSearchGlassOuter}>
              <BlurView
                intensity={Platform.OS === "ios" ? 40 : 32}
                tint="light"
                style={styles.deptSearchBlur}
              />
              <View style={styles.deptSearchGlassWash} pointerEvents="none" />
              <LinearGradient
                pointerEvents="none"
                colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                style={styles.deptSearchInnerShine}
              />
              <LinearGradient
                pointerEvents="none"
                colors={["transparent", "rgba(17, 24, 39, 0.04)"]}
                style={styles.deptSearchInnerFloor}
              />
              <View style={styles.deptSearchRow}>
                <View style={styles.deptSearchMainHit}>
                  <Feather name="search" size={18} color={colors.text} style={styles.deptSearchIcon} />
                  <View style={styles.deptGroceryInputWrap}>
                    <TextInput
                      ref={searchInputRef}
                      value={value}
                      onChangeText={setSearchValue}
                      onFocus={() => setBrowseSearchFocused(true)}
                      onBlur={() => setBrowseSearchFocused(false)}
                      placeholder={isSearching || browseSearchFocused ? "Search products" : ""}
                      placeholderTextColor={colors.textMuted}
                      style={[styles.deptSearchTextInput, { color: colors.text }]}
                      returnKeyType="search"
                      cursorColor={colors.primary}
                      underlineColorAndroid="transparent"
                    />
                    {!value.trim() && !browseSearchFocused ? (
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.deptSearchPlaceholderOverlay,
                          {
                            opacity: browseSearchTextOpacity,
                            transform: [{ translateY: browseSearchTextTranslateY }],
                          },
                        ]}
                      >
                        <Text style={styles.deptSearchPlaceholderText} numberOfLines={1}>
                          {activeBrowseSearchLead}
                        </Text>
                      </Animated.View>
                    ) : null}
                  </View>
                </View>
                {isSearching ? (
                  <Pressable
                    onPress={() => setSearchValue("")}
                    style={styles.deptCartSegment}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                  >
                    <Text style={styles.searchClearSegmentText}>Clear</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.deptCartSegment}
                    onPress={() => navigation.navigate("Cart")}
                    accessibilityRole="button"
                    accessibilityLabel={`Cart, ${cartCount} items`}
                  >
                    <Feather name="shopping-cart" size={18} color="#111827" />
                    {cartCount > 0 ? (
                      <View style={styles.deptCartBadge}>
                        <Text style={styles.deptCartBadgeText}>
                          {cartCount > 99 ? "99+" : String(cartCount)}
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>

        {!isSearching ? (
          <>

            {browseStatus === "loading" ? (
              <SkeletonBrowse />
            ) : browseStatus === "error" ? (
              <View style={styles.loadingInline}>
                <Text style={styles.errorTitle}>Something went wrong</Text>
                <Text style={styles.errorHint}>{browseError}</Text>
                <Pressable
                  onPress={() => setBrowseLoadKey((k) => k + 1)}
                  style={styles.retryBtn}
                >
                  <Text style={styles.retryBtnText}>Try again</Text>
                </Pressable>
              </View>
            ) : (
              <Animated.View style={{ flex: 1, opacity: contentOpacity }}>
              <ScrollView
                style={styles.browseScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
              >
                {quickPicksDisplay.length > 0 ? (
                  <BrowseSectionAnimated index={0} style={styles.sectionNoHPad}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: H_PAD }]}>Popular right now</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.quickRow}
                      style={{ overflow: "visible" }}
                    >
                      {quickPicksDisplay.map(({ category, department }, qIdx) => (
                        <BrowseItemAnimated
                          key={category.slug || category.id || category.name}
                          index={qIdx}
                          style={styles.quickItemWrap}
                        >
                          <Item
                            text={category.name}
                            image={categoryImageSource(category)}
                            show
                            onPress={() =>
                              openCategorySearch(
                                category.name,
                                department.slug,
                                department.name,
                                {
                                  slug: category.slug,
                                  imageUrl: category.imageUrl,
                                  iconUrl: category.iconUrl,
                                }
                              )
                            }
                          />
                        </BrowseItemAnimated>
                      ))}
                    </ScrollView>
                  </BrowseSectionAnimated>
                ) : null}

                <BrowseSectionAnimated index={1} style={styles.sectionNoHPad}>
                  <Text style={[styles.sectionTitle, { paddingHorizontal: H_PAD }]}>All categories</Text>
                  {departmentBrowse.map((row, deptIdx) => {
                    const d = row.department;
                    const key = d.slug || d.id || d.name;
                    return (
                      <BrowseItemAnimated key={key} index={deptIdx} style={styles.groupBlock}>
                        <Pressable
                          onPress={() => {
                            if (d.slug) navigation.navigate("Department", { slug: d.slug });
                          }}
                          disabled={!d.slug}
                          style={({ pressed }) => [
                            styles.deptGroupHeader,
                            !d.slug && styles.deptGroupHeaderDisabled,
                            pressed && d.slug && styles.deptGroupHeaderPressed,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel={d.slug ? `Open ${d.name} department` : d.name}
                        >
                          <Text style={styles.deptGroupTitle} numberOfLines={1}>
                            {d.name}
                          </Text>
                          {d.slug ? (
                            <Feather name="chevron-right" size={20} color="#425928" />
                          ) : null}
                        </Pressable>
                        {row.categories.length > 0 ? (
                          <ItemCategory
                            items={row.categories.map((c) => ({
                              id: c.id,
                              text: c.name,
                              slug: c.slug,
                              image: categoryImageSource(c),
                              imageUrl: c.imageUrl,
                              iconUrl: c.iconUrl,
                              departmentSlug: d.slug,
                              departmentName: d.name,
                            }))}
                            show
                            color="#BC6C25"
                            hideBottomBorder
                            style={styles.itemCategoryFlush}
                            onPress={(item) =>
                              openCategorySearch(item.text, item.departmentSlug, item.departmentName, {
                                slug: item.slug,
                                imageUrl: item.imageUrl,
                                iconUrl: item.iconUrl,
                              })
                            }
                          />
                        ) : null}
                      </BrowseItemAnimated>
                    );
                  })}
                </BrowseSectionAnimated>

                <BrowseSectionAnimated index={2} style={styles.sectionNoHPad}>
                  <Text style={[styles.sectionTitle, { paddingHorizontal: H_PAD }]}>Trending searches</Text>
                  <View style={[styles.trendingWrap, { paddingHorizontal: H_PAD }]}>
                    {TRENDING_TERMS.map((term, tIdx) => (
                      <BrowseItemAnimated key={term} index={tIdx}>
                        <Pressable
                          onPress={() => setValue(term)}
                          style={({ pressed }) => [styles.trendChip, pressed && styles.trendChipPressed]}
                        >
                          <Text style={styles.trendChipText}>{term}</Text>
                        </Pressable>
                      </BrowseItemAnimated>
                    ))}
                  </View>
                </BrowseSectionAnimated>
              </ScrollView>
              </Animated.View>
            )}
          </>
        ) : (
          <View style={styles.searchActive}>
            {searchResults.length === 0 ? (
              <View style={styles.emptySearch}>
                <Text style={styles.emptySearchTitle}>No matches</Text>
                <Text style={styles.emptySearchHint}>
                  Try another word, pick a category below, or clear search.
                </Text>
                <Pressable onPress={() => setSearchValue("")} style={styles.emptySearchBtn}>
                  <Text style={styles.emptySearchBtnText}>Back to browse</Text>
                </Pressable>
              </View>
            ) : (
              <ProductCategory items={searchResults} bottomPadding={bottomPad} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8f6f2",
  },
  root: {
    flex: 1,
    paddingHorizontal: 0,
  },
  browseScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  loadingInline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  loadingHint: {
    marginTop: 12,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
  },
  errorTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  errorHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "rgba(66, 89, 40, 0.15)",
  },
  retryBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#425928",
  },
  headerBlock: {
    marginBottom: 20,
    paddingHorizontal: H_PAD,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#6b7280",
    marginTop: 6,
    lineHeight: 22,
  },
  browseSearchWrap: {
    width: "100%",
    marginBottom: 28,
    paddingHorizontal: H_PAD,
  },
  browseSearchWrapActive: {
    marginBottom: 12,
    paddingHorizontal: H_PAD,
  },
  deptSearchBackdrop: {
    width: "100%",
    paddingVertical: 0,
  },
  deptSearchGlassOuter: {
    width: "100%",
    alignSelf: "center",
    borderRadius: BROWSE_SEARCH_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
    ...Platform.select({
      android: { backgroundColor: "rgba(255, 255, 255, 0.92)" },
    }),
  },
  deptSearchBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  deptSearchGlassWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(254, 252, 248, 0.36)",
  },
  deptSearchInnerShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: BROWSE_SEARCH_RADIUS,
    borderTopRightRadius: BROWSE_SEARCH_RADIUS,
  },
  deptSearchInnerFloor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    borderBottomLeftRadius: BROWSE_SEARCH_RADIUS,
    borderBottomRightRadius: BROWSE_SEARCH_RADIUS,
  },
  deptSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 4,
    minHeight: 48,
  },
  deptSearchMainHit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    paddingRight: 8,
  },
  deptGroceryInputWrap: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    position: "relative",
    justifyContent: "center",
  },
  deptSearchPlaceholderOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "stretch",
  },
  deptSearchIcon: {
    marginLeft: 2,
  },
  deptSearchPlaceholderText: {
    color: "rgba(55, 65, 81, 0.82)",
    fontSize: 12,
    letterSpacing: 0.08,
    fontFamily: "Poppins-Regular",
    lineHeight: 18,
    ...Platform.select({
      android: { textAlignVertical: "center", includeFontPadding: false },
    }),
  },
  deptSearchTextInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#111827",
    minWidth: 0,
    margin: 0,
    paddingHorizontal: 0,
    minHeight: 48,
    includeFontPadding: false,
    ...Platform.select({
      ios: { paddingVertical: 14 },
      android: { paddingVertical: 0, textAlignVertical: "center", height: 48 },
    }),
  },
  deptCartSegment: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(17, 24, 39, 0.12)",
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  deptCartBadge: {
    position: "absolute",
    top: 6,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#BC6C25",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  deptCartBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Poppins-Bold",
  },
  searchClearSegmentText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#425928",
  },
  deptGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: H_PAD,
    borderRadius: 12,
  },
  deptGroupHeaderPressed: {
    backgroundColor: "rgba(66, 89, 40, 0.06)",
  },
  deptGroupHeaderDisabled: {
    opacity: 0.7,
  },
  deptGroupTitle: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#111827",
    letterSpacing: 0.2,
    marginRight: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionNoHPad: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#111827",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  itemCategoryFlush: {
    paddingHorizontal: H_PAD,
  },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
    gap: 10,
  },
  quickItemWrap: {
    marginRight: 4,
  },
  groupBlock: {
    marginBottom: 16,
  },
  trendingWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  trendChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "rgba(66, 89, 40, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(66, 89, 40, 0.12)",
  },
  trendChipPressed: {
    backgroundColor: "rgba(66, 89, 40, 0.14)",
  },
  trendChipText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#374151",
  },
  searchActive: {
    flex: 1,
    paddingHorizontal: H_PAD,
  },
  emptySearch: {
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  emptySearchTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#111827",
    marginBottom: 8,
  },
  emptySearchHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  emptySearchBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: "rgba(66, 89, 40, 0.12)",
  },
  emptySearchBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#425928",
  },
});
