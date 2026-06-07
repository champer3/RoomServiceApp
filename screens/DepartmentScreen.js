import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  ImageBackground,
  InteractionManager,
} from "react-native";
import Text from "../components/Text";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons, Ionicons, EvilIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { selectTotalCartCount } from "../Data/cart";
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
import AppImage from "../components/AppImage";
import SkeletonDepartment from "../components/SkeletonDepartment";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const DEPT_SEARCH_RADIUS = 15;
const STICKY_HEADER_ESTIMATE = 120;
const FOOD_TABS_VISIBILITY_HYSTERESIS = 14;
/** Match home search bar rotation cadence */
const DEPT_SEARCH_BAR_ROTATION_MS = 4600;
const DEPT_FOOD_COLUMNS_PER_ROW = SCREEN_W >= 420 ? 5 : SCREEN_W >= 380 ? 4 : 3;
const FOOD_CAT_PALETTE = ["#BC6C25", "#283618", "#E07A5F", "#3D405B", "#81B29A", "#F2CC8F"];
const FOOD_DECO_ICONS = [
  "restaurant-outline", "pizza-outline", "cafe-outline", "nutrition-outline",
  "leaf-outline", "ice-cream-outline", "fish-outline", "beer-outline",
  "fast-food-outline", "wine-outline", "flame-outline", "water-outline",
];
const FOOD_DECO_POSITIONS = [
  { top: 4, right: 12, rotate: "-15deg", size: 30 },
  { top: 8, right: 75, rotate: "22deg", size: 22 },
  { top: 6, right: 140, rotate: "-8deg", size: 26 },
  { top: 32, right: 8, rotate: "18deg", size: 18 },
  { top: 28, right: 50, rotate: "-30deg", size: 24 },
  { top: 36, right: 110, rotate: "12deg", size: 20 },
  { bottom: 30, right: 16, rotate: "25deg", size: 22 },
  { bottom: 28, right: 80, rotate: "-20deg", size: 28 },
  { bottom: 32, right: 145, rotate: "8deg", size: 18 },
  { bottom: 6, right: 35, rotate: "-12deg", size: 26 },
  { bottom: 8, right: 105, rotate: "30deg", size: 20 },
  { bottom: 10, left: 14, rotate: "-18deg", size: 22 },
  { top: 10, left: 10, rotate: "15deg", size: 20 },
  { top: 38, left: 8, rotate: "-25deg", size: 16 },
  { bottom: 30, left: 10, rotate: "10deg", size: 18 },
];

const FoodDecoIcons = React.memo(({ index }) => {
  const offset = (index * 4) % FOOD_DECO_ICONS.length;
  return (
    <>
      {FOOD_DECO_POSITIONS.map((pos, i) => {
        const iconName = FOOD_DECO_ICONS[(offset + i) % FOOD_DECO_ICONS.length];
        return (
          <View
            key={i}
            style={[
              styles.decoIcon,
              {
                ...(pos.top != null && { top: pos.top }),
                ...(pos.bottom != null && { bottom: pos.bottom }),
                ...(pos.right != null && { right: pos.right }),
                ...(pos.left != null && { left: pos.left }),
                transform: [{ rotate: pos.rotate }],
              },
            ]}
          >
            <Ionicons name={iconName} size={pos.size} color="rgba(255,255,255,0.13)" />
          </View>
        );
      })}
    </>
  );
});

const FoodSectionAnimated = React.memo(({ index, children, style, onLayout }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        style,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

const FoodCatNameAnimated = React.memo(({ delay, children }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 450,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
});

const FoodCardAnimated = React.memo(({ index, children, style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: 200 + index * 80,
      friction: 6,
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
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

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

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const [hasRevealed, setHasRevealed] = useState(false);

  const scrollRef = useRef(null);
  const sectionYRef = useRef({});
  const isUserTapScrolling = useRef(false);
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
    const handle = InteractionManager.runAfterInteractions(() => {
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
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [slug]);

  useEffect(() => {
    if (!loading && payload && !hasRevealed) {
      setHasRevealed(true);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [loading, payload, hasRevealed, contentOpacity]);

  const departmentMeta = payload?.department;
  const layoutPreset =
    departmentMeta?.categoryNavStyle === "grid"
      ? "catalog"
      : departmentMeta?.layoutPreset === "grocery"
        ? "grocery"
        : "food";
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

    if (!isUserTapScrolling.current) {
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
    isUserTapScrolling.current = true;
    setActiveCategorySlug(catSlug);
    const y = sectionYRef.current[catSlug];
    if (y == null) {
      isUserTapScrolling.current = false;
      return;
    }
    scrollRef.current?.scrollTo({
      y: Math.max(0, y - STICKY_HEADER_ESTIMATE + 36),
      animated: true,
    });
    setTimeout(() => { isUserTapScrolling.current = false; }, 600);
  };

  const promosOverride = useMemo(() => {
    const p = payload?.promotions || {};
    const layout = payload?.department?.layoutPreset === "grocery" ? "grocery" : "food";
    const hero =
      layout === "grocery" || layoutPreset === "catalog"
        ? p.topBanner || []
        : mergeDepartmentHeroPromos(p.hero, p.topBanner);
    return {
      hero,
      featuredStrip: p.featuredStrip || [],
    };
  }, [payload?.promotions, payload?.department?.layoutPreset]);

  const cartCount = useSelector(selectTotalCartCount);

  if (loading) {
    return <SkeletonDepartment />;
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
  const heroVariant = layoutPreset === "grocery" || layoutPreset === "catalog" ? "departmentSlim" : "departmentLarge";
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
          {layoutPreset === "grocery" || layoutPreset === "catalog" ? (
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
    <View style={styles.foodTabsContainer}>
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
        {(payload?.categories || []).map((cat, catIdx) => {
          const key = (cat.slug && String(cat.slug).toLowerCase()) || guessCategorySlug(cat.name);
          const active = activeCategorySlug === key;
          const pillColor = FOOD_CAT_PALETTE[catIdx % FOOD_CAT_PALETTE.length];
          return (
            <Pressable
              key={cat.id || key}
              onPress={() => scrollToCategory(key)}
              style={[styles.tabPill, active && { backgroundColor: pillColor }]}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                foodTabLayoutsRef.current[key] = { x, width };
              }}
            >
              {active && (
                <Ionicons name="ellipse" size={6} color="rgba(255,255,255,0.8)" style={{ marginRight: 5 }} />
              )}
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{cat.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
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
      featuredCardWidth={layoutPreset !== "food" ? 168 : 175}
      featuredCompact={layoutPreset !== "food"}
    />
  ) : null;

  const rootInsetStyle = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  if (layoutPreset === "catalog") {
    const catalogCats = (payload?.categories || []).filter((cat) => {
      const catKey = (cat.slug && String(cat.slug).toLowerCase()) || guessCategorySlug(cat.name);
      const sec = sections.find((s) => {
        const sk = (s.category.slug && String(s.category.slug).toLowerCase()) || guessCategorySlug(s.category.name);
        return sk === catKey;
      });
      return sec && sec.products.filter((p) => p?.availability !== false).length > 0;
    });

    return (
      <Animated.View style={[styles.root, rootInsetStyle, { opacity: contentOpacity }]}>
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {titleHeaderBlock}
          {stickySearchBlock}
          {promoBlock}

          {groceryQuery.trim().length > 0 ? (
            groceryList.filter((p) => p?.availability !== false).length > 0 ? (
              <View style={styles.gridWrap}>
                {groceryList.filter((p) => p?.availability !== false).map((p) => (
                  <View key={p._id != null ? String(p._id) : p.title} style={styles.gridCell}>
                    <Product product={p} layout="grid" />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="search-outline" size={40} color="#BC6C25" />
                </View>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyHint}>Try a different search term or browse our categories</Text>
              </View>
            )
          ) : catalogCats.length > 0 ? (
            <View style={styles.catalogGrid}>
              {catalogCats.map((cat, catIdx) => {
                const catKey = (cat.slug && String(cat.slug).toLowerCase()) || guessCategorySlug(cat.name);
                const rawImg = cat.imageUrl || cat.iconUrl;
                const catImg = typeof rawImg === "string" && rawImg.startsWith("http") ? rawImg : null;
                const fbColor = FOOD_CAT_PALETTE[catIdx % FOOD_CAT_PALETTE.length];

                const cardContent = (
                  <>
                    {catImg && <View style={styles.catalogCardOverlay} />}
                    <FoodDecoIcons index={catIdx} />
                    <View style={styles.catalogCardBottom}>
                      <Text style={styles.catalogCardName} numberOfLines={2}>{cat.name}</Text>
                      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
                    </View>
                  </>
                );

                return (
                  <FoodCardAnimated key={cat.id || catKey} index={catIdx} style={styles.catalogCardWrap}>
                    <Pressable
                      onPress={() => navigation.navigate("Category", {
                        cat: cat.name,
                        categorySlug: catKey,
                        departmentSlug: slug,
                        departmentName: payload?.department?.name || "",
                        imageUrl: cat.imageUrl,
                        iconUrl: cat.iconUrl,
                      })}
                      style={styles.catalogCard}
                    >
                      {catImg ? (
                        <ImageBackground
                          source={{ uri: catImg }}
                          style={styles.catalogCardBg}
                          imageStyle={styles.catalogCardBgImage}
                          resizeMode="cover"
                        >
                          {cardContent}
                        </ImageBackground>
                      ) : (
                        <LinearGradient
                          colors={[`${fbColor}EE`, fbColor, `${fbColor}CC`]}
                          locations={[0, 0.5, 1]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.catalogCardBg}
                        >
                          {cardContent}
                        </LinearGradient>
                      )}
                    </Pressable>
                  </FoodCardAnimated>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="bag-outline" size={40} color="#BC6C25" />
              </View>
              <Text style={styles.emptyTitle}>No categories here yet</Text>
              <Text style={styles.emptyHint}>Check back soon — we're adding items all the time</Text>
              <Pressable onPress={() => navigation.navigate("HomeTabs")} style={styles.emptyBtn}>
                <Ionicons name="arrow-back" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.emptyBtnText}>Browse other items</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
        <FloatingCartFab count={cartCount} onPress={() => navigation.navigate("Cart")} bottomOffset={102} />
      </Animated.View>
    );
  }

  if (layoutPreset === "grocery") {
    return (
      <Animated.View style={[styles.root, rootInsetStyle, { opacity: contentOpacity }]}>
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {titleHeaderBlock}
          {stickySearchBlock}
          {promoBlock}

          {groceryQuery.trim().length > 0 ? (
            groceryList.filter((p) => p?.availability !== false).length > 0 ? (
              <View style={styles.gridWrap}>
                {groceryList.filter((p) => p?.availability !== false).map((p) => (
                  <View key={p._id != null ? String(p._id) : p.title} style={styles.gridCell}>
                    <Product product={p} layout="grid" />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="search-outline" size={40} color="#BC6C25" />
                </View>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyHint}>Try a different search term or browse our categories</Text>
              </View>
            )
          ) : (
            <>
              {/* Category card carousel */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groceryCarouselContent}
                style={styles.groceryCarousel}
              >
                {sections.map((sec, secIdx) => {
                  const catKey =
                    (sec.category.slug && String(sec.category.slug).toLowerCase()) ||
                    guessCategorySlug(sec.category.name);
                  const available = sec.products.filter((p) => p?.availability !== false);
                  if (!available.length) return null;
                  const rawImg = sec.category.imageUrl || sec.category.iconUrl;
                  const catImg = typeof rawImg === "string" && rawImg.startsWith("http") ? rawImg : null;
                  const fbColor = FOOD_CAT_PALETTE[secIdx % FOOD_CAT_PALETTE.length];
                  const isActive = groceryCategorySlug === catKey;

                  const cardContent = (
                    <>
                      {catImg && <View style={styles.groceryCardOverlay} />}
                      <FoodDecoIcons index={secIdx} />
                      <Text style={styles.groceryCardName} numberOfLines={2}>{sec.category.name}</Text>
                      <Text style={styles.groceryCardCount}>{available.length} items</Text>
                    </>
                  );

                  return (
                    <FoodCardAnimated
                      key={sec.category.id || catKey}
                      index={secIdx}
                      style={styles.groceryCardAnimWrap}
                    >
                      <Pressable
                        onPress={() => setGroceryCategorySlug(isActive ? null : catKey)}
                        style={[styles.groceryCard, isActive && styles.groceryCardActive]}
                      >
                        {catImg ? (
                          <ImageBackground
                            source={{ uri: catImg }}
                            style={styles.groceryCardBg}
                            imageStyle={styles.groceryCardBgImage}
                            resizeMode="cover"
                          >
                            {cardContent}
                          </ImageBackground>
                        ) : (
                          <LinearGradient
                            colors={[`${fbColor}EE`, fbColor, `${fbColor}CC`]}
                            locations={[0, 0.5, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.groceryCardBg}
                          >
                            {cardContent}
                          </LinearGradient>
                        )}
                      </Pressable>
                    </FoodCardAnimated>
                  );
                })}
              </ScrollView>

              {/* Selected category products */}
              {(() => {
                const activeSec = groceryCategorySlug
                  ? sections.find((s) => {
                      const k = (s.category.slug && String(s.category.slug).toLowerCase()) || guessCategorySlug(s.category.name);
                      return k === groceryCategorySlug;
                    })
                  : sections[0];
                if (!activeSec) return null;
                const activeKey = (activeSec.category.slug && String(activeSec.category.slug).toLowerCase()) || guessCategorySlug(activeSec.category.name);
                const activeProducts = activeSec.products.filter((p) => p?.availability !== false);
                if (!activeProducts.length) return null;
                return (
                  <FoodSectionAnimated index={0} style={styles.groceryProductsSection} key={activeKey}>
                    <View style={styles.groceryProductsHeader}>
                      <Text style={styles.groceryProductsTitle}>{activeSec.category.name}</Text>
                      <Pressable
                        onPress={() => navigation.navigate("Category", {
                          cat: activeSec.category.name,
                          categorySlug: activeKey,
                          departmentSlug: slug,
                          departmentName: payload?.department?.name || "",
                          imageUrl: activeSec.category.imageUrl,
                          iconUrl: activeSec.category.iconUrl,
                        })}
                        style={styles.grocerySeeAllBtn}
                      >
                        <Text style={styles.grocerySeeAllText}>See all</Text>
                        <Ionicons name="arrow-forward" size={14} color="#BC6C25" />
                      </Pressable>
                    </View>
                    <View style={styles.gridWrap}>
                      {activeProducts.slice(0, 6).map((p, pIdx) => (
                        <FoodCardAnimated
                          key={p._id != null ? String(p._id) : p.id != null ? String(p.id) : `gsel-${pIdx}`}
                          index={pIdx}
                          style={styles.gridCell}
                        >
                          <Product product={p} layout="grid" />
                        </FoodCardAnimated>
                      ))}
                    </View>
                  </FoodSectionAnimated>
                );
              })()}

              {sections.every((s) => s.products.filter((p) => p?.availability !== false).length === 0) && (
                <View style={styles.emptyWrap}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="bag-outline" size={40} color="#BC6C25" />
                  </View>
                  <Text style={styles.emptyTitle}>No products here yet</Text>
                  <Text style={styles.emptyHint}>Check back soon — we're adding items all the time</Text>
                  <Pressable onPress={() => navigation.navigate("HomeTabs")} style={styles.emptyBtn}>
                    <Ionicons name="arrow-back" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.emptyBtnText}>Browse other items</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}
        </ScrollView>
        <FloatingCartFab count={cartCount} onPress={() => navigation.navigate("Cart")} bottomOffset={102} />
      </Animated.View>
    );
  }

  /* —— Food layout —— */
  return (
    <Animated.View style={[styles.root, rootInsetStyle, { opacity: contentOpacity }]}>
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
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={40} color="#BC6C25" />
              </View>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyHint}>Try a different search term or browse our categories</Text>
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
            {sections.map((sec, secIdx) => {
              const key =
                (sec.category.slug && String(sec.category.slug).toLowerCase()) ||
                guessCategorySlug(sec.category.name);
              const availableProducts = sec.products.filter((p) => p?.availability !== false);
              if (!availableProducts.length) return null;
              const rawImage = sec.category.imageUrl || sec.category.iconUrl;
              const catImage = typeof rawImage === "string" && rawImage.startsWith("http") ? rawImage : null;
              const fallbackColor = FOOD_CAT_PALETTE[secIdx % FOOD_CAT_PALETTE.length];
              const sectionInner = (
                <>
                  {catImage && <View style={styles.foodSectionOverlay} />}
                  <FoodDecoIcons index={secIdx} />

                  {/* Category header row */}
                  <FoodCatNameAnimated delay={secIdx * 120 + 100}>
                    <Pressable
                      onPress={() => navigation.navigate("Category", {
                        cat: sec.category.name,
                        categorySlug: key,
                        departmentSlug: slug,
                        departmentName: payload?.department?.name || "",
                        imageUrl: sec.category.imageUrl,
                        iconUrl: sec.category.iconUrl,
                      })}
                      style={styles.foodCatHeaderRow}
                    >
                      <Text style={styles.foodCatName}>{sec.category.name}</Text>
                      <View style={styles.foodCatBadge}>
                        <Text style={styles.foodCatBadgeText}>{availableProducts.length}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
                    </Pressable>
                    <View style={styles.foodCatDivider} />
                  </FoodCatNameAnimated>

                  {/* Floating product rail */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.foodRailContent}
                  >
                    {availableProducts.map((product, pIdx) => (
                      <FoodCardAnimated
                        key={product._id != null ? String(product._id) : product.id != null ? String(product.id) : `fp-${secIdx}-${pIdx}`}
                        index={pIdx}
                        style={styles.foodRailCard}
                      >
                        <Product product={product} layout="rail" />
                      </FoodCardAnimated>
                    ))}
                  </ScrollView>
                </>
              );

              return (
                <FoodSectionAnimated
                  key={sec.category.id || key}
                  index={secIdx}
                  style={styles.foodSectionWrap}
                  onLayout={(e) => {
                    sectionYRef.current[key] = e.nativeEvent.layout.y;
                  }}
                >
                  <View>
                    {catImage ? (
                      <ImageBackground
                        source={{ uri: catImage }}
                        style={styles.foodSectionBg}
                        imageStyle={styles.foodSectionBgImage}
                        resizeMode="cover"
                      >
                        {sectionInner}
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={[`${fallbackColor}EE`, fallbackColor, `${fallbackColor}CC`]}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.foodSectionBg}
                      >
                        <LinearGradient
                          colors={["rgba(0,0,0,0.12)", "rgba(0,0,0,0.03)", "rgba(0,0,0,0.18)"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <FoodDecoIcons index={secIdx} />
                        {sectionInner}
                      </LinearGradient>
                    )}
                  </View>
                </FoodSectionAnimated>
              );
            })}
            {sections.every((s) => s.products.length === 0) ? (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="restaurant-outline" size={40} color="#BC6C25" />
                </View>
                <Text style={styles.emptyTitle}>No products here yet</Text>
                <Text style={styles.emptyHint}>Check back soon — we're adding items all the time</Text>
                <Pressable onPress={() => navigation.navigate("HomeTabs")} style={styles.emptyBtn}>
                  <Ionicons name="arrow-back" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.emptyBtnText}>Browse other items</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
      <FloatingCartFab count={cartCount} onPress={() => navigation.navigate("Cart")} bottomOffset={102} />
    </Animated.View>
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
    borderBottomWidth: 1,
    borderColor: "rgba(17,24,39,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  stickyFoodTabsVisible: {
    paddingTop: 6,
    paddingBottom: 8,
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
  foodTabsContainer: {
    paddingVertical: 4,
  },
  tabsRow: {
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 8,
  },
  tabPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(17,24,39,0.06)",
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#6b7280",
  },
  tabLabelActive: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
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
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 10,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(188,108,37,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#111827",
    textAlign: "center",
  },
  emptyHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#283618",
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 28,
    marginTop: 12,
  },
  emptyBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#fff",
  },

  catalogGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
    marginTop: 12,
  },
  catalogCardWrap: {
    width: (SCREEN_W - 28 - 12) / 2,
  },
  catalogCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  catalogCardBg: {
    borderRadius: 20,
    overflow: "hidden",
    height: 230,
    justifyContent: "flex-end",
  },
  catalogCardBgImage: { borderRadius: 20 },
  catalogCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
  },
  catalogCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  catalogCardName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#fff",
    flex: 1,
    lineHeight: 20,
  },

  groceryCardAnimWrap: {},
  groceryCarousel: { marginTop: 8 },
  groceryCarouselContent: { paddingHorizontal: 14, gap: 10 },
  groceryCard: {
    width: 130,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "transparent",
  },
  groceryCardActive: {
    borderColor: "#BC6C25",
  },
  groceryCardBg: {
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 14,
    height: 110,
    justifyContent: "flex-end",
  },
  groceryCardBgImage: { borderRadius: 16 },
  groceryCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 16,
  },
  groceryCardName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#fff",
    lineHeight: 18,
  },
  groceryCardCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  groceryProductsSection: { marginTop: 20 },
  groceryProductsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  groceryProductsTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#111827",
    flex: 1,
  },
  grocerySeeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  grocerySeeAllText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#BC6C25",
  },

  foodSectionWrap: { marginBottom: 20, marginHorizontal: 14 },
  foodSectionBg: { borderRadius: 22, overflow: "hidden", paddingTop: 18, paddingBottom: 16 },
  foodSectionBgImage: { borderRadius: 22 },
  foodSectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 22,
  },
  foodCatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  foodCatName: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  foodCatBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  foodCatBadgeText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#fff",
  },
  foodCatDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 1,
  },
  decoIcon: { position: "absolute", zIndex: 0 },
  foodRailContent: { paddingHorizontal: 14 },
  foodRailCard: { marginRight: 6 },
});
