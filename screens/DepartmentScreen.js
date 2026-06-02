import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Platform,
  Animated,
  Easing,
  Image,
} from "react-native";
import Text from "../components/Text";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons, Ionicons, EvilIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { fetchAppDepartment } from "../api/appPromotions";
import {
  groupProductsByCategoryOrder,
  categoryKeyFromProduct,
  guessCategorySlug,
} from "../utils/departmentProducts";
import PromotionHomeSection from "../components/promotions/PromotionHomeSection";
import Product from "../components/Product/Product";
import ProductCategory from "../components/Category/ProductCategory";
import ProductHorizontal from "../components/Category/ProductHorizontal";
import FloatingCartFab from "../components/FloatingCartFab";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const DEPT_SEARCH_RADIUS = 15;
const STICKY_HEADER_ESTIMATE = 120;
const FOOD_TABS_VISIBILITY_HYSTERESIS = 14;
/** Match home search bar rotation cadence */
const DEPT_SEARCH_BAR_ROTATION_MS = 4600;
const DEPT_FOOD_COLUMNS_PER_ROW = SCREEN_W >= 420 ? 5 : SCREEN_W >= 380 ? 4 : 3;

/**
 * @param {string} departmentName
 * @param {Array<{ name?: string }>} categories
 * @returns {{ lead: string }[]}
 */
/** Food: prefer slot `hero` (Department — Hero), then legacy `top_banner`; dedupe by id. */
function mergeDepartmentHeroPromos(heroSlot, topBanner) {
  const seen = new Set();
  const out = [];
  for (const x of [...(heroSlot || []), ...(topBanner || [])]) {
    const id = x?.id;
    if (id != null) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    out.push(x);
  }
  return out;
}

function buildDeptSearchPhrases(departmentName, categories) {
  const d = String(departmentName || "Department").trim() || "Department";
  const leads = [
    `Search ${d}`,
    `Find something in ${d}`,
    `Browse ${d}`,
  ];
  const seen = new Set(leads);
  const out = leads.map((lead) => ({ lead }));
  const list = Array.isArray(categories) ? categories : [];
  for (const cat of list) {
    const n = cat?.name != null ? String(cat.name).trim() : "";
    if (!n) continue;
    const line = `Search ${n}`;
    if (!seen.has(line)) {
      seen.add(line);
      out.push({ lead: line });
    }
  }
  return out.length ? out : [{ lead: `Search ${d}` }];
}

function countDeliveringOrders(orders) {
  if (!Array.isArray(orders)) return 0;
  let count = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status === "Out for Delivery") count++;
  }
  return count;
}

/** Same matching rules as CategorySearch `searchTitles`, with de-duplication by id/title. */
function searchTitlesDept(items, searchPhrase) {
  const result = [];
  const seen = new Set();
  const push = (item) => {
    const k = item._id != null ? String(item._id) : String(item.title ?? "");
    if (!k || seen.has(k)) return;
    seen.add(k);
    result.push(item);
  };
  if (!searchPhrase || searchPhrase.length < 1) return result;
  const sp = searchPhrase.toLowerCase();
  items.forEach((item) => {
    if (String(item.title || "").toLowerCase().includes(sp)) {
      push(item);
    } else if (item.related) {
      item.related.forEach((keyword) => {
        if (String(keyword).toLowerCase().includes(sp)) push(item);
      });
    } else if (item.subCategory) {
      item.subCategory.forEach((keyword) => {
        if (String(keyword).toLowerCase().includes(sp)) push(item);
      });
    } else if (item.nutrients) {
      item.nutrients.forEach((keyword) => {
        if (keyword.name && String(keyword.name).toLowerCase().includes(sp)) push(item);
      });
    } else if (item.components) {
      item.components.forEach((keyword) => {
        if (String(keyword).toLowerCase().includes(sp)) push(item);
      });
    }
  });
  return result;
}

export default function DepartmentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const slug = route.params?.slug || "";

  const [payload, setPayload] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const productItems = useSelector((state) => state.productItems.ids);
  const cartItems = useSelector((state) => state.cartItems.ids);
  const orders = useSelector((state) => state.orders?.ids ?? []);

  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [groceryQuery, setGroceryQuery] = useState("");
  const [groceryCategorySlug, setGroceryCategorySlug] = useState(null);
  const [grocerySearchFocused, setGrocerySearchFocused] = useState(false);
  const [foodQuery, setFoodQuery] = useState("");
  const [foodSearchFocused, setFoodSearchFocused] = useState(false);
  /** Food: show sticky category tabs only after user scrolls to the category sections */
  const [foodScrollY, setFoodScrollY] = useState(0);
  const [foodCategoryBlockY, setFoodCategoryBlockY] = useState(null);
  const [foodStickyTabsVisible, setFoodStickyTabsVisible] = useState(false);
  const [deptSearchSectionHeight, setDeptSearchSectionHeight] = useState(64);
  const [foodTabsViewportWidth, setFoodTabsViewportWidth] = useState(0);
  const [foodTabsContentWidth, setFoodTabsContentWidth] = useState(0);

  const scrollRef = useRef(null);
  const sectionYRef = useRef({});
  const foodTabsScrollRef = useRef(null);
  const foodTabsScrollXRef = useRef(0);
  const foodTabLayoutsRef = useRef({});

  const deptSearchPhrases = useMemo(
    () => buildDeptSearchPhrases(payload?.department?.name, payload?.categories),
    [payload?.department?.name, payload?.categories]
  );

  const [deptSearchPhraseIndex, setDeptSearchPhraseIndex] = useState(0);
  const deptSearchTextOpacity = useRef(new Animated.Value(1)).current;
  const deptSearchTextTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setDeptSearchPhraseIndex(0);
    deptSearchTextOpacity.setValue(1);
    deptSearchTextTranslateY.setValue(0);
  }, [payload?.department?.name, payload?.categories]);

  useEffect(() => {
    const len = deptSearchPhrases.length;
    if (len <= 1) return undefined;

    let cancelled = false;
    const advance = () => {
      if (cancelled) return;
      Animated.parallel([
        Animated.timing(deptSearchTextOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(deptSearchTextTranslateY, {
          toValue: -6,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;
        setDeptSearchPhraseIndex((i) => (i + 1) % len);
        deptSearchTextTranslateY.setValue(7);
        Animated.parallel([
          Animated.timing(deptSearchTextOpacity, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(deptSearchTextTranslateY, {
            toValue: 0,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    const id = setInterval(advance, DEPT_SEARCH_BAR_ROTATION_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [deptSearchPhrases.length, deptSearchTextOpacity, deptSearchTextTranslateY]);

  useEffect(() => {
    setFoodScrollY(0);
    setFoodCategoryBlockY(null);
    setFoodStickyTabsVisible(false);
    setFoodTabsViewportWidth(0);
    setFoodTabsContentWidth(0);
    foodTabsScrollXRef.current = 0;
    foodTabLayoutsRef.current = {};
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setLoading(false);
      setLoadError("Missing department");
      return undefined;
    }
    setLoading(true);
    setLoadError(null);
    fetchAppDepartment(slug)
      .then((d) => {
        if (!cancelled) {
          setPayload(d);
          const cats = d?.categories || [];
          if (cats[0]?.slug) setActiveCategorySlug(String(cats[0].slug).toLowerCase());
          else if (cats[0]?.name) setActiveCategorySlug(guessCategorySlug(cats[0].name));
        }
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e?.message || "Could not load department");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const departmentMeta = payload?.department;
  const layoutPreset = departmentMeta?.layoutPreset === "grocery" ? "grocery" : "food";
  const categoryNavStyle = departmentMeta?.categoryNavStyle || "tabs";

  const sections = useMemo(() => {
    if (!departmentMeta) return [];
    return groupProductsByCategoryOrder(productItems, departmentMeta, payload?.categories || []);
  }, [productItems, departmentMeta, payload?.categories]);

  const deliveringCount = useMemo(() => countDeliveringOrders(orders), [orders]);

  const allDeptProducts = useMemo(() => {
    const map = new Map();
    sections.forEach((s) => {
      s.products.forEach((p) => {
        const k = p._id != null ? String(p._id) : p.title;
        map.set(k, p);
      });
    });
    return [...map.values()];
  }, [sections]);

  const groceryList = useMemo(() => {
    let list = allDeptProducts;
    if (groceryCategorySlug) {
      list = list.filter((p) => categoryKeyFromProduct(p.category) === groceryCategorySlug);
    }
    const q = groceryQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => String(p.title || "").toLowerCase().includes(q));
    }
    return list;
  }, [allDeptProducts, groceryCategorySlug, groceryQuery]);

  const foodSearchResults = useMemo(
    () => searchTitlesDept(allDeptProducts, foodQuery.trim()),
    [allDeptProducts, foodQuery]
  );
  const foodHasSearch = foodQuery.trim().length > 0;

  const onFoodScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    setFoodScrollY(Math.round(y));
    if (foodHasSearch) {
      if (foodStickyTabsVisible) setFoodStickyTabsVisible(false);
      return;
    }
    if (foodCategoryBlockY != null) {
      const enterAt = foodCategoryBlockY;
      const exitAt = foodCategoryBlockY - FOOD_TABS_VISIBILITY_HYSTERESIS;
      if (!foodStickyTabsVisible && y >= enterAt) {
        setFoodStickyTabsVisible(true);
      } else if (foodStickyTabsVisible && y < exitAt) {
        setFoodStickyTabsVisible(false);
      }
    }

    // Auto-activate tab based on scroll position near the sticky header.
    const probeY = y + STICKY_HEADER_ESTIMATE + 6;
    let nextActive = null;
    for (let i = 0; i < sections.length; i += 1) {
      const sec = sections[i];
      if (!sec.products.length) continue;
      const key =
        (sec.category.slug && String(sec.category.slug).toLowerCase()) ||
        guessCategorySlug(sec.category.name);
      const sy = sectionYRef.current[key];
      if (sy != null && sy <= probeY) {
        nextActive = key;
      }
    }
    if (!nextActive) {
      for (let i = 0; i < sections.length; i += 1) {
        const sec = sections[i];
        if (!sec.products.length) continue;
        nextActive =
          (sec.category.slug && String(sec.category.slug).toLowerCase()) ||
          guessCategorySlug(sec.category.name);
        break;
      }
    }
    if (nextActive && nextActive !== activeCategorySlug) {
      setActiveCategorySlug(nextActive);
    }
  };

  useEffect(() => {
    if (!showFoodStickyTabs) return;
    if (!activeCategorySlug) return;
    const layout = foodTabLayoutsRef.current[activeCategorySlug];
    if (!layout) return;
    const contentW = foodTabsContentWidth;
    const viewportW = foodTabsViewportWidth;
    if (!contentW || !viewportW) return;

    const leftInset = 12;
    const maxScroll = Math.max(0, contentW - viewportW);
    const desired = Math.max(0, Math.min(maxScroll, layout.x - leftInset));
    const current = foodTabsScrollXRef.current;
    if (Math.abs(desired - current) < 8) return;
    foodTabsScrollRef.current?.scrollTo({ x: desired, animated: true });
  }, [activeCategorySlug, showFoodStickyTabs, foodTabsContentWidth, foodTabsViewportWidth]);

  const scrollToCategory = (catSlug) => {
    setActiveCategorySlug(catSlug);
    const y = sectionYRef.current[catSlug];
    if (y == null) return;
    scrollRef.current?.scrollTo({
      y: Math.max(0, y - STICKY_HEADER_ESTIMATE + 36),
      animated: true,
    });
  };

  const promosOverride = useMemo(() => {
    const p = payload?.promotions || {};
    const layout = payload?.department?.layoutPreset === "grocery" ? "grocery" : "food";
    const hero =
      layout === "grocery"
        ? p.topBanner || []
        : mergeDepartmentHeroPromos(p.hero, p.topBanner);
    return {
      hero,
      featuredStrip: p.featuredStrip || [],
    };
  }, [payload?.promotions, payload?.department?.layoutPreset]);

  const cartCount = cartItems?.length ?? 0;

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#425928" />
      </View>
    );
  }

  if (loadError || !departmentMeta) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top, paddingHorizontal: 24 }]}>
        <Text style={styles.errorText}>{loadError || "Department not found"}</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const title = departmentMeta.name || "Department";
  const heroVariant = layoutPreset === "grocery" ? "departmentSlim" : "departmentLarge";
  const deptPhraseLen = Math.max(deptSearchPhrases.length, 1);
  const activeDeptSearchLead =
    deptSearchPhrases[deptSearchPhraseIndex % deptPhraseLen]?.lead || `Search ${title}`;

  const searchCartBar = (
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
          {layoutPreset === "grocery" ? (
            <View style={styles.deptSearchMainHit}>
              <Feather name="search" size={18} color="#111827" style={styles.deptSearchIcon} />
              <View style={styles.deptGroceryInputWrap}>
                <TextInput
                  value={groceryQuery}
                  onChangeText={setGroceryQuery}
                  onFocus={() => setGrocerySearchFocused(true)}
                  onBlur={() => setGrocerySearchFocused(false)}
                  placeholder={
                    groceryQuery.length > 0 || grocerySearchFocused ? undefined : ""
                  }
                  placeholderTextColor="rgba(107,114,128,0.82)"
                  style={styles.deptSearchTextInput}
                />
                {!groceryQuery.trim() && !grocerySearchFocused ? (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.deptSearchPlaceholderOverlay,
                      {
                        opacity: deptSearchTextOpacity,
                        transform: [{ translateY: deptSearchTextTranslateY }],
                      },
                    ]}
                  >
                    <Text style={styles.deptSearchPlaceholderText} numberOfLines={1}>
                      {activeDeptSearchLead}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.deptSearchMainHit}>
              <Feather name="search" size={18} color="#111827" style={styles.deptSearchIcon} />
              <View style={styles.deptGroceryInputWrap}>
                <TextInput
                  value={foodQuery}
                  onChangeText={setFoodQuery}
                  onFocus={() => setFoodSearchFocused(true)}
                  onBlur={() => setFoodSearchFocused(false)}
                  placeholder={
                    foodQuery.length > 0 || foodSearchFocused ? undefined : ""
                  }
                  placeholderTextColor="rgba(107,114,128,0.82)"
                  style={styles.deptSearchTextInput}
                  cursorColor="#aaa"
                />
                {!foodQuery.trim() && !foodSearchFocused ? (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.deptSearchPlaceholderOverlay,
                      {
                        opacity: deptSearchTextOpacity,
                        transform: [{ translateY: deptSearchTextTranslateY }],
                      },
                    ]}
                  >
                    <Text style={styles.deptSearchPlaceholderText} numberOfLines={1}>
                      {activeDeptSearchLead}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
            </View>
          )}
          <Pressable
            style={styles.deptCartSegment}
            onPress={() => navigation.navigate("Cart")}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
          >
            <Feather name="shopping-cart" size={18} color="#111827" />
            {cartCount > 0 ? (
              <View style={styles.deptCartBadge}>
                <Text style={styles.deptCartBadgeText}>{cartCount > 99 ? "99+" : String(cartCount)}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
    </View>
  );

  const titleHeaderBlock = (
    <View style={styles.deptTitleScrollSection}>
      <View style={[styles.deptTitleScrollInner]}>
        <View style={styles.deptTitleRow}>
          <View style={styles.deptTitleRowSide}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.deptBackOuter}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <BlurView
                intensity={Platform.OS === "ios" ? 82 : 58}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                pointerEvents="none"
                colors={[
                  "rgba(255, 255, 255, 0.78)",
                  "rgba(252, 252, 251, 0.52)",
                  "rgba(248, 249, 246, 0.44)",
                ]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                pointerEvents="none"
                colors={["rgba(255, 255, 255, 0.35)", "transparent"]}
                style={styles.deptBackHighlight}
              />
              <View style={styles.deptBackIconWrap} pointerEvents="none">
                <Ionicons name="chevron-back" size={18} color="#111827" />
              </View>
            </Pressable>
          </View>
          <Text style={styles.deptHeaderTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.deptTitleRowSide} />
        </View>
        {deliveringCount > 0 ? (
          <Pressable style={styles.orderPill} onPress={() => navigation.navigate("Order History")}>
            <MaterialIcons name="local-shipping" size={18} color="#425928" />
            <Text style={styles.orderPillText}>{deliveringCount} on the way · Track</Text>
            <Feather name="chevron-right" size={16} color="#6b7280" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const categoryNavFood = (
    <ScrollView
      ref={foodTabsScrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}
      onLayout={(e) => setFoodTabsViewportWidth(e.nativeEvent.layout.width)}
      onContentSizeChange={(w) => setFoodTabsContentWidth(w)}
      onScroll={(e) => {
        foodTabsScrollXRef.current = e.nativeEvent.contentOffset.x;
      }}
      scrollEventThrottle={16}
    >
      {(payload?.categories || []).map((cat) => {
        const key = (cat.slug && String(cat.slug).toLowerCase()) || guessCategorySlug(cat.name);
        const active = activeCategorySlug === key;
        return (
          <Pressable
            key={cat.id || key}
            onPress={() => scrollToCategory(key)}
            style={styles.tabHit}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              foodTabLayoutsRef.current[key] = { x, width };
            }}
          >
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{cat.name}</Text>
            {active ? <View style={styles.tabUnderline} /> : <View style={styles.tabUnderlineSpacer} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const showFoodStickyTabs =
    layoutPreset === "food" &&
    !foodHasSearch &&
    foodStickyTabsVisible;

  const stickySearchBlock = (
    <View style={styles.stickySearchBarWrap}>
      <View
        style={styles.deptSearchSection}
        onLayout={(e) => setDeptSearchSectionHeight(e.nativeEvent.layout.height)}
      >
        {searchCartBar}
      </View>
      {layoutPreset === "food" && !foodHasSearch ? (
        <View
          style={[
            styles.stickyFoodTabsOverlay,
            styles.stickyFoodTabsWrap,
            showFoodStickyTabs ? styles.stickyFoodTabsVisible : styles.stickyFoodTabsHidden,
            { top: deptSearchSectionHeight },
          ]}
          pointerEvents={showFoodStickyTabs ? "auto" : "none"}
        >
          {categoryNavFood}
        </View>
      ) : null}
    </View>
  );

  const renderCategoryNavGrocery = () => {
    const cats = payload?.categories || [];
    if (categoryNavStyle === "grid") {
      return (
        <View style={styles.catGrid}>
          {cats.map((cat) => {
            const key = (cat.slug && String(cat.slug).toLowerCase()) || guessCategorySlug(cat.name);
            const active = groceryCategorySlug === key;
            return (
              <Pressable
                key={cat.id || key}
                style={[styles.catGridCell, active && styles.catGridCellActive]}
                onPress={() => setGroceryCategorySlug(active ? null : key)}
              >
                <Text style={[styles.catGridLabel, active && styles.catGridLabelActive]} numberOfLines={2}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      );
    }
    return (
      <View style={styles.chipsRow}>
        <Pressable
          style={[styles.chip, groceryCategorySlug == null && styles.chipActive]}
          onPress={() => setGroceryCategorySlug(null)}
        >
          <Text style={[styles.chipText, groceryCategorySlug == null && styles.chipTextActive]}>All</Text>
        </Pressable>
        {cats.map((cat) => {
          const key = (cat.slug && String(cat.slug).toLowerCase()) || guessCategorySlug(cat.name);
          const active = groceryCategorySlug === key;
          return (
            <Pressable
              key={cat.id || key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setGroceryCategorySlug(active ? null : key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.name}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const hasPromoRail =
    (promosOverride.hero && promosOverride.hero.length > 0) ||
    (promosOverride.featuredStrip && promosOverride.featuredStrip.length > 0);

  const promoBlock = hasPromoRail ? (
    <PromotionHomeSection
      promotionsOverride={promosOverride}
      buckets={["hero", "featuredStrip"]}
      navigation={navigation}
      products={productItems}
      heroVariant={heroVariant}
      featuredCardWidth={layoutPreset === "grocery" ? 168 : 175}
      featuredCompact={layoutPreset === "grocery"}
    />
  ) : null;

  const rootInsetStyle = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  if (layoutPreset === "grocery") {
    return (
      <View style={[styles.root, rootInsetStyle]}>
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {titleHeaderBlock}
          {stickySearchBlock}
          {promoBlock}
          {renderCategoryNavGrocery()}
          <View style={styles.gridWrap}>
            {groceryList.map((p) => (
              <View key={p._id != null ? String(p._id) : p.title} style={styles.gridCell}>
                <Product product={p} layout="grid" />
              </View>
            ))}
          </View>
          {groceryList.length === 0 ? (
            <Text style={styles.emptyText}>No products in this department yet.</Text>
          ) : null}
        </ScrollView>
        <FloatingCartFab count={cartCount} onPress={() => navigation.navigate("Cart")} bottomOffset={102} />
      </View>
    );
  }

  /* —— Food layout —— */
  return (
    <View style={[styles.root, rootInsetStyle]}>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100}}
        scrollEventThrottle={16}
        onScroll={onFoodScroll}
      >
        {titleHeaderBlock}
        {stickySearchBlock}
        {promoBlock}
        {foodHasSearch ? (
          foodSearchResults.length > 0 ? (
            <ProductCategory
              onTouch={() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
              items={foodSearchResults}
            />
          ) : (
            <View style={styles.deptFoodSearchEmpty}>
              <Image style={styles.deptFoodSearchEmptyImg} source={require("../assets/empty.png")} />
              <Text style={styles.deptFoodSearchEmptyText}>We don't have this item yet 😥😥.</Text>
            </View>
          )
        ) : (
          <>
            <View
              collapsable={false}
              pointerEvents="none"
              onLayout={(e) => setFoodCategoryBlockY(e.nativeEvent.layout.y)}
              style={styles.foodCategorySectionsMarker}
            />
            {sections.map((sec) => {
              const key =
                (sec.category.slug && String(sec.category.slug).toLowerCase()) ||
                guessCategorySlug(sec.category.name);
              if (!sec.products.length) return null;
              return (
                <View
                  key={sec.category.id || key}
                  onLayout={(e) => {
                    sectionYRef.current[key] = e.nativeEvent.layout.y;
                  }}
                >
                  <ProductHorizontal
                    categoryName={sec.category.name}
                    items={sec.products}
                    columnsPerRow={DEPT_FOOD_COLUMNS_PER_ROW}
                    productLayout="rail"
                  />
                </View>
              );
            })}
            {sections.every((s) => s.products.length === 0) ? (
              <Text style={styles.emptyText}>No products in this department yet.</Text>
            ) : null}
          </>
        )}
      </ScrollView>
      <FloatingCartFab count={cartCount} onPress={() => navigation.navigate("Cart")} bottomOffset={102} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8f6f2",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f6f2",
  },
  errorText: {
    textAlign: "center",
    color: "#6b7280",
    fontFamily: "Poppins-Medium",
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#425928",
    borderRadius: 999,
  },
  backBtnText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  deptTitleScrollSection: {
    backgroundColor: "transparent",
  },
  deptTitleScrollInner: {
    paddingHorizontal: 16,
    // paddingBottom: 12,
    backgroundColor: "transparent",
  },
  stickySearchBarWrap: {
    position: "relative",
    overflow: "visible",
    backgroundColor: "#f8f6f2",
    paddingHorizontal: 26,
    // paddingBottom: 12,
  },
  stickyFoodTabsOverlay: {
    position: "absolute",
    left: -26,
    right: -26,
    zIndex: 8,
    elevation: 8,
  },
  stickyFoodTabsWrap: {
    backgroundColor: "#f8f6f2",
  },
  stickyFoodTabsVisible: {
    // paddingTop: 8,
    // paddingBottom: 4,
    
    borderBottomWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  stickyFoodTabsHidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  /** Marks where category list starts (same Y as first section) for sticky tab reveal + scroll threshold */
  foodCategorySectionsMarker: {
    height: 0,
    width: "100%",
  },
  deptTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  deptTitleRowSide: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  deptHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111827",
    letterSpacing: 0.2,
    paddingHorizontal: 8,
  },
  deptSearchSection: {
    width: "100%",
    paddingTop: 10,
    paddingBottom:12
  },
  /** Match FloatingPillTabBar glass pill (blur + gradients + border) */
  deptBackOuter: {
    width: 35,
    height: 35,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 14,
  },
  deptBackHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  deptBackIconWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  deptSearchBackdrop: {
    width: "100%",
    paddingVertical: 0,
  },
  deptSearchGlassOuter: {
    width: "100%",
    alignSelf: "center",
    borderRadius: DEPT_SEARCH_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
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
    borderTopLeftRadius: DEPT_SEARCH_RADIUS,
    borderTopRightRadius: DEPT_SEARCH_RADIUS,
  },
  deptSearchInnerFloor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    borderBottomLeftRadius: DEPT_SEARCH_RADIUS,
    borderBottomRightRadius: DEPT_SEARCH_RADIUS,
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
  deptSearchAnimatedTextWrap: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    minHeight: 48,
    justifyContent: "center",
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
    ...Platform.select({
      ios: { paddingVertical: 14 },
      android: { paddingVertical: 0, textAlignVertical: "center" },
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
  orderPill: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(66, 89, 40, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(66, 89, 40, 0.22)",
  },
  orderPillText: {
    flex: 1,
    color: "#1f2937",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
  tabsRow: {
    // paddingHorizontal: 22,
    // gap: 4,
    alignItems: "flex-end",
  },
  tabHit: {
    // marginRight: 16,
    paddingHorizontal: 22
    // paddingBottom: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#6b7280",
  },
  tabLabelActive: {
    color: "#111827",
  },
  tabUnderline: {
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: "#425928",
    marginTop: 6,
    
  },
  tabUnderlineSpacer: {
    height: 3,
    marginTop: 6,
    opacity: 0,
  },
  chipsRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "rgba(66, 89, 40, 0.15)",
    borderColor: "#425928",
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#374151",
  },
  chipTextActive: {
    color: "#283618",
    fontFamily: "Poppins-SemiBold",
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  catGridCell: {
    width: (SCREEN_W - 12 * 2 - 10) / 2,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
  },
  catGridCellActive: {
    borderColor: "#425928",
    backgroundColor: "rgba(66, 89, 40, 0.1)",
  },
  catGridLabel: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
    textAlign: "center",
  },
  catGridLabelActive: {
    color: "#283618",
  },
  sectionHeading: {
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 16,
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#425928",
    textAlign: "center",
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 8,
    justifyContent: "space-between",
  },
  gridCell: {
    width: (SCREEN_W - 32 - 10) / 2,
    marginBottom: 12,
  },
  deptFoodSearchEmpty: {
    gap: 19,
    marginBottom: 45,
    paddingHorizontal: 16,
  },
  deptFoodSearchEmptyImg: {
    height: SCREEN_H / 3,
    alignSelf: "center",
    resizeMode: "contain",
  },
  deptFoodSearchEmptyText: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    color: "#374151",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#9ca3af",
    fontFamily: "Poppins-Medium",
    paddingHorizontal: 24,
  },
});
