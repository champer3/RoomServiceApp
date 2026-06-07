import React from "react";
import { Image, Pressable, Dimensions, ImageBackground, Platform, Animated } from "react-native";
import { StyleSheet, View } from "react-native";
import Text from '../Text';
import AppImage from '../AppImage';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../Data/cart';
import { toggleFavorite } from '../../Data/favorites';
import useThrottledPress from '../../hooks/useThrottledPress';
import { useRef, useEffect, useCallback } from 'react';
const { width } = Dimensions.get("window");
import { buildDefaultFormObject } from "../../utils/productCartForm";
import { emitCartAdd } from '../../utils/cartEvents';

const CARD_WIDTH = 160;
const BTN_SIZE = 38;
const STEPPER_SLIDE_W = CARD_WIDTH -80;

function formatPriceShort(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  return x.toFixed(2);
}

function Product({ product, layout = 'rail' }) {
  function isValidURL(str) {
    if (typeof str !== 'string') str = String(str);
    return str.startsWith("http://") || str.startsWith("https://");
  }

  const productData = buildDefaultFormObject(product);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids);

  const canAddToCart = () => {
    if (product?.extra) return false;
    if (Array.isArray(product?.components) && product.components.length > 0) return false;
    for (let opt of Array.isArray(product?.options) ? product.options : []) {
      if (opt?.required) return false;
    }
    if (Array.isArray(product?.variantGroups) && product.variantGroups.length > 0) return false;
    if (Array.isArray(product?.addons) && product.addons.length > 0) return false;
    return true;
  };

  function addQuantityToObjects(inputList) {
    const result = {};
    inputList.forEach(obj => {
      const title = obj.products[0].title;
      result[title] = (result[title] ?? 0) + obj.products.length;
    });
    return result;
  }

  const newList = addQuantityToObjects(cartItems);
  const quantity = newList[product.title] || 0;

  const prevQtyRef = useRef(quantity);
  const stepperAnim = useRef(new Animated.Value(quantity > 0 ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const wasZero = prevQtyRef.current === 0;
    const nowPositive = quantity > 0;
    prevQtyRef.current = quantity;

    if (wasZero && nowPositive) {
      Animated.spring(stepperAnim, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: false,
      }).start();
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.18, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 130, useNativeDriver: true }),
      ]).start();
    } else if (!nowPositive) {
      Animated.timing(stepperAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [quantity, stepperAnim, scaleAnim]);

  const _handleIncrement = useThrottledPress(() => {
    if (!canAddToCart()) {
      navigation.navigate('Product', { product, productData });
      return;
    }
    dispatch(addToCart({ id: productData }));
    emitCartAdd();
  }, 400);
  function handleIncrement() { _handleIncrement(); }

  function handleDecrement(index) {
    dispatch(removeFromCart({ id: { 'index': index } }));
  }

  const pressHandler = useThrottledPress(() => {
    navigation.navigate('Product', { product, productData });
  }, 500);

  const favoriteIds = useSelector((state) => state.favorites.ids);
  const isFavorited = favoriteIds.includes(product._id || product.id);
  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(product._id || product.id));
  }, [dispatch, product._id, product.id]);

  const meta = product?.metadata && typeof product.metadata === "object" ? product.metadata : {};
  const brandStr = meta.brand != null ? String(meta.brand).trim() : "";
  const unitStr = meta.unit_size != null ? String(meta.unit_size).trim() : "";
  const metaLine = [brandStr, unitStr].filter(Boolean).join(" · ");
  const tagList = Array.isArray(product?.tags)
    ? product.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  const subCats = Array.isArray(product?.subCategory) ? product.subCategory : [];
  const pillLabels = [...new Set([...subCats, ...tagList])].slice(0, 4);
  const morePills = [...new Set([...subCats, ...tagList])].length - pillLabels.length;
  const shortBlurb = String(product?.shortDescription || "").trim();
  const longBlurb = String(product?.description || "").trim();
  const blurb = shortBlurb || longBlurb;
  const basePrice = Number(product?.price) || 0;
  const compareRaw = Number(product?.comparePrice);
  const showCompare = Number.isFinite(compareRaw) && compareRaw > basePrice + 0.001;

  const ratingAvg = Number(product?.ratingsAverage);
  const ratingQty = Number(product?.ratingsQuantity);
  const hasRatings = Number.isFinite(ratingQty) && ratingQty > 0;
  const stockNum = Number(product?.stock);
  const lowThresh = Number(product?.lowStockThreshold);
  const isLowStock = Number.isFinite(stockNum) && Number.isFinite(lowThresh) && stockNum > 0 && stockNum <= lowThresh;
  const isOutOfStock = product?.availability === false;
  const categoryLabel = product?.category ? String(product.category).trim() : "";
  const discountPct = showCompare ? Math.round(((compareRaw - basePrice) / compareRaw) * 100) : 0;

  const cardW = layout === 'grid' ? Math.max(140, Math.floor((width - 85) / 2)) : CARD_WIDTH;
  const imgH = layout === 'grid' ? 108 : 142;
  const listImgUri =
    Array.isArray(product?.images) && product.images[0] && isValidURL(product.images[0])
      ? product.images[0] : null;

  const stepperWidth = stepperAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, STEPPER_SLIDE_W],
  });
  const stepperOpacity = stepperAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0, 1],
  });

  const renderOverlayControls = useCallback(() => {
    const sz = layout === 'grid' ? BTN_SIZE - 2 : BTN_SIZE;
    const iconSz = layout === 'grid' ? 20 : 23;

    return (
      <View style={[styles.overlayControls, { backgroundColor:  quantity > 0 ? 'rgba(188, 108, 37, 0.65)' : '' }]}>
        <Animated.View
          style={[
            styles.stepperSlide,
            { width: stepperWidth, opacity: stepperOpacity },
          ]}
        >
          <Pressable
            onPress={() => {
              const idx = cartItems.findIndex(item => product.title === item.products[0].title);
              if (idx !== -1) handleDecrement(idx);
            }}
            style={[styles.circleBtn, { width: sz - 8, height: sz - 8, marginRight: 10 }]}
            hitSlop={6}
          >
            <AntDesign name="minus" size={iconSz} color="#fff" />
          </Pressable>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{quantity}</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPress={handleIncrement}
            style={[styles.circleBtn, { width: sz, height: sz }]}
            hitSlop={4}
          >
            <AntDesign name="plus" size={iconSz} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    );
  }, [quantity, cartItems, product.title, stepperWidth, stepperOpacity, scaleAnim, layout, handleIncrement, handleDecrement]);

  // ───────── List layout ─────────
  if (layout === 'list') {
    return (
      <View style={styles.listContainer}>
        <View style={styles.listRow}>
          <Pressable onPress={pressHandler} style={styles.listMainPress}>
            <AppImage uri={listImgUri} style={styles.listImage} resizeMode="cover" />
            <View style={styles.listBody}>
              <Text style={styles.listTitle} numberOfLines={2}>{product.title}</Text>
              {blurb ? (
                <Text style={styles.listDesc} numberOfLines={2}>{blurb}</Text>
              ) : null}
              {pillLabels.length > 0 ? (
                <View style={styles.listPills}>
                  {pillLabels.slice(0, 3).map((item, index) => (
                    <View key={`${item}-${index}`} style={styles.listPill}>
                      <Text style={styles.listPillText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={styles.listPriceRow}>
                {showCompare ? (
                  <Text style={styles.comparePrice}>${formatPriceShort(compareRaw)}</Text>
                ) : null}
                <Text style={styles.listPrice}>${basePrice.toFixed(2)}</Text>
              </View>
            </View>
          </Pressable>
          <Pressable onPress={handleToggleFavorite} style={styles.listFavBtn} hitSlop={6}>
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={22}
              color={isFavorited ? "#E11D48" : "#9CA3AF"}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  // ───────── Rail / Grid layout ─────────
  return (
    <View style={[styles.container, layout === 'grid' && { marginRight: 0 }]}>
      <Pressable onPress={pressHandler}>
        {Array.isArray(product?.images) && product.images[0] && isValidURL(product.images[0]) ? (
          <ImageBackground
            style={[styles.image, { width: cardW, height: imgH }]}
            imageStyle={{ borderRadius: layout === 'grid' ? 14 : 16 }}
            source={{ uri: product.images[0] }}
          >
            <View style={[styles.imageOverlay, { width: cardW, borderRadius: layout === 'grid' ? 14 : 16 }]}>
              {renderOverlayControls()}
              <View style={[styles.detailsContainer, { maxWidth: cardW }]}>
                {pillLabels.map((item, index) => (
                  <View key={`${item}-${index}`} style={styles.pill}>
                    <Text style={styles.pillText}>{item}</Text>
                  </View>
                ))}
                {morePills > 0 ? (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>+{morePills}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.imagePlaceholder, { width: cardW, height: imgH, borderRadius: layout === 'grid' ? 14 : 16 }]}>
            {renderOverlayControls()}
          </View>
        )}
      </Pressable>

      <Text
        style={[styles.name, { width: cardW }, layout === 'grid' && styles.nameGrid]}
        numberOfLines={layout === 'grid' ? 2 : 1}
        ellipsizeMode="tail"
      >
        {product.title}
      </Text>
      {metaLine ? (
        <Text style={[styles.metaLine, { width: cardW }]} numberOfLines={1} ellipsizeMode="tail">
          {metaLine}
        </Text>
      ) : null}
      {blurb ? (
        <Text
          style={[styles.description, { width: cardW }, layout === 'grid' && styles.descriptionGrid]}
          numberOfLines={layout === 'grid' ? 1 : 2}
          ellipsizeMode="tail"
        >
          {blurb}
        </Text>
      ) : layout !== 'grid' ? (
        <Text style={[styles.description, { width: cardW, opacity: 0.7 }]} numberOfLines={1}>
          Tap for details
        </Text>
      ) : null}

      {(hasRatings || isLowStock || isOutOfStock) && layout !== 'grid' ? (
        <View style={[styles.infoRow, { width: cardW }]}>
          {hasRatings ? (
            <Text style={styles.ratingText}>
              {Number.isFinite(ratingAvg) ? ratingAvg.toFixed(1) : "—"} ★ ({ratingQty})
            </Text>
          ) : null}
          {isOutOfStock ? (
            <Text style={styles.outOfStockText}>Out of stock</Text>
          ) : isLowStock ? (
            <Text style={styles.lowStockText}>Few left</Text>
          ) : null}
        </View>
      ) : null}

      <View style={{ width: cardW }}>
        <View style={styles.priceOrderRow}>
          <View style={{ flexShrink: 1, marginRight: 6 }}>
            {showCompare ? (
              <View style={styles.comparePriceRow}>
                <Text style={styles.comparePrice}>${formatPriceShort(compareRaw)}</Text>
                {discountPct > 0 ? <Text style={styles.discountBadge}>-{discountPct}%</Text> : null}
              </View>
            ) : null}
            <Text style={[styles.price, layout === 'grid' && styles.priceGrid]} numberOfLines={1}>
              ${basePrice.toFixed(2)}
            </Text>
          </View>
          <Pressable onPress={handleToggleFavorite} style={styles.favBtn} hitSlop={6}>
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={layout === 'grid' ? 18 : 20}
              color={isFavorited ? "#E11D48" : "#9CA3AF"}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default React.memo(Product);

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 10,
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
      },
      android: { elevation: 4 },
    }),
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: CARD_WIDTH,
    height: 142,
    borderRadius: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#e8ebe6',
    overflow: 'hidden',
  },
  imageOverlay: {
    flex: 1,
    overflow: 'hidden',
  },

  // +/- controls floating on image
  overlayControls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    maxWidth: 150,
    zIndex: 10,
  },
  stepperSlide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    overflow: 'hidden',
  },
  circleBtn: {
    backgroundColor: '#283618',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1},
    //     shadowOpacity: 0.35,
    //     shadowRadius: 3,
    //   },
    //   android: { elevation: 5 },
    // }),
  },
  countBadge: {
    backgroundColor: '#fff',
    borderRadius: 999,
    minWidth: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: { elevation: 3 },
    }),
  },
  countText: {
    fontSize: 13,
    color: '#283618',
    fontFamily: "Poppins-Bold",
    textAlign: 'center',
  },

  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    gap: 4,
    bottom: 6,
    paddingHorizontal: 6,
    maxWidth: CARD_WIDTH,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(66, 89, 40, 0.4)',
  },
  pillText: {
    fontSize: 10,
    color: '#2d3d22',
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.25,
  },

  name: {
    fontSize: 16,
    width: CARD_WIDTH,
    marginTop: 8,
    color: '#111827',
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.2,
  },
  nameGrid: {
    fontSize: 14,
    marginTop: 6,
  },
  description: {
    fontSize: 11,
    color: 'rgba(17,24,39,0.68)',
    width: CARD_WIDTH,
    marginVertical: 4,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: "Poppins-Regular",
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  descriptionGrid: {
    fontSize: 10,
    marginVertical: 2,
  },
  metaLine: {
    fontSize: 10,
    color: 'rgba(17,24,39,0.6)',
    width: CARD_WIDTH,
    marginTop: 2,
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 11,
    color: '#92400E',
    fontFamily: "Poppins-Medium",
  },
  lowStockText: {
    fontSize: 10,
    color: '#B45309',
    fontFamily: "Poppins-Medium",
  },
  outOfStockText: {
    fontSize: 10,
    color: '#B91C1C',
    fontFamily: "Poppins-Medium",
  },
  comparePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  comparePrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontFamily: "Poppins-Regular",
  },
  discountBadge: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#B91C1C',
    fontFamily: "Poppins-Bold",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  price: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.8)',
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.4,
  },
  priceGrid: {
    fontSize: 14,
  },

  // Bottom row: price + Order button
  priceOrderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },

  // List layout
  listContainer: {
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  listRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },
  listMainPress: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    minWidth: 0,
  },
  listImage: {
    width: 96,
    height: 96,
    borderRadius: 14,
    backgroundColor: "#e8ebe6",
  },
  listImagePlaceholder: {
    backgroundColor: "#e5e7eb",
  },
  listBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111827",
    letterSpacing: 0.2,
  },
  listDesc: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(17,24,39,0.55)",
    fontFamily: "Poppins-Regular",
    lineHeight: 16,
  },
  listPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  listPill: {
    backgroundColor: "rgba(66, 89, 40, 0.12)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  listPillText: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#2d3d22",
  },
  listPriceRow: {
    marginTop: 10,
  },
  listPrice: {
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },
  favBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listFavBtn: {
    alignSelf: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
