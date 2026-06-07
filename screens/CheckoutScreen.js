import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  Dimensions,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import Text from "../components/Text";
import AppImage from "../components/AppImage";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import {
  clearCart,
  addToCart,
  removeFromCart,
  deleteFromCart,
  addOptions,
  updateCart,
  selectTotalCartCount,
} from "../Data/cart";
import { completeOrder } from "../Data/order";
import OrderSuccess from "../components/Modals/OrderSuccess";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckoutPromoRow from "../components/promotions/CheckoutPromoRow";
import { initializeSocket, getSocket, disconnectSocket } from "../socketService";
import { SERVER_URL } from "../config";
import RoomServiceAlert, { ROOM_SERVICE_ALERT_TYPES } from "../components/RoomServiceAlert";
import { cartLineTotal } from "../utils/productCartForm";
import MapView, { Marker } from "react-native-maps";
import { getPosition } from "../util/location";
import { MAP_STYLE } from "../utils/mapStyle";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const MAP_HEIGHT = 160;

function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const cartItems = useSelector((state) => state.cartItems.ids);
  const totalCartCount = useSelector(selectTotalCartCount);
  const data = useSelector((state) => state.profileData.profile);
  const address = [...data.address];

  const [visible, setVisible] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [num, setNum] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [checkoutPromo, setCheckoutPromo] = useState(null);
  const lastOrderForReceipt = useRef({ items: [], total: 0, id: null, deliveryFee: 0 });
  const scrollRef = useRef(null);
  const notesLayoutY = useRef(0);
  const [addressCoords, setAddressCoords] = useState(null);

  const isPickup = fulfillmentType === "pickup";
  const hasAddress = address.length > 0;
  const canOrder = isPickup ? cartItems.length > 0 : hasAddress && cartItems.length > 0;

  const deliveryModes = [
    { label: "Express", time: "10–15 min", fee: 2, icon: "flash-outline" },
    { label: "Standard", time: "30–45 min", fee: 0, icon: "time-outline" },
  ];

  useEffect(() => {
    if (!hasAddress) { setAddressCoords(null); return; }
    let cancelled = false;
    (async () => {
      const addr = address[0]?.address;
      if (!addr) return;
      const pos = await getPosition(addr);
      if (!cancelled && pos?.lat) setAddressCoords({ latitude: pos.lat, longitude: pos.lng });
    })();
    return () => { cancelled = true; };
  }, [hasAddress, address[0]?.address]);

  // ─── Business logic (preserved) ───
  useEffect(() => { retrieveTokenFromAsyncStorage(); }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("@checkout_promo_v1");
        if (!raw || cancelled) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setCheckoutPromo(parsed);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const retrieveTokenFromAsyncStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken !== null) return storedToken;
      else navigation.navigate("Account");
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  const calculateTotalPrice = (formObject) => cartLineTotal(formObject);

  const totalOrderPrice = cartItems?.reduce((sum, item) => sum + calculateTotalPrice(item), 0);
  const taxesAndFees = 0.3 * totalOrderPrice;
  const deliveryFee = isPickup ? 0 : deliveryModes[num].fee;
  const promoDiscount = Number(checkoutPromo?.appliedAmount || 0);
  const total = Math.max(0, totalOrderPrice + taxesAndFees + deliveryFee - promoDiscount);

  function handleDeleteFromCart(index) {
    dispatch(deleteFromCart({ id: { index } }));
    if (cartItems.length <= 1) navigation.goBack();
  }

  function handleProductClick(item, index) {
    const product = item.products[0];
    navigation.replace("Product", { product, productData: item });
    requestAnimationFrame(() => {
      dispatch(deleteFromCart({ id: { index } }));
    });
  }

  function getTodaysDate() {
    return new Date().toString();
  }

  function generateRandomId(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  }

  function constructOrderDetails(formObject) {
  const products = Array.isArray(formObject?.products) ? formObject.products : [];
  const firstProduct = products[0];
  return {
    productName: firstProduct?.title || "",
    component: formObject?.components || "",
      sides: Array.isArray(formObject?.extra) ? formObject.extra.map((item) => JSON.stringify(item)) : [],
      flavor: Array.isArray(formObject?.options) ? formObject.options.map((option) => JSON.stringify(option)) : [],
      dressing: products.map((product) => JSON.stringify({ title: product?.title, images: product?.images, price: product?.price })),
    };
  }

  function buildOrderItemsFromCart(cartLines, calcPrice) {
  return cartLines.map((row) => {
    const products = Array.isArray(row?.products) ? row.products : [];
    const first = products[0];
    const qty = Math.max(1, products.length);
    const pid = first?._id ?? first?.id ?? first?.productId ?? first?.productID;
    const unitPrice = Number(first?.price || 0);
      const lineTotal = calcPrice(row);

    const variants = [];
    (row.options || []).forEach((opt) => {
      try {
        const p = typeof opt === "string" ? JSON.parse(opt) : opt;
        (p.values || []).forEach((val) => {
            variants.push({ groupName: p.name || "Option", choiceName: val.name || "", priceAdjustment: Number(val.price || 0) });
          });
        } catch { /* ignore */ }
        });
    (row.variantSelections || []).forEach((g) => {
      (g.selected || []).forEach((c) => {
          variants.push({ groupName: g.groupName || "Option", choiceName: c.name || "", priceAdjustment: Number(c.priceDelta) || 0 });
      });
    });

    const addonsFromExtra = (row.extra || []).map((ex) => {
      try {
        const a = typeof ex === "string" ? JSON.parse(ex) : ex;
        const up = Number(a.price || 0);
          return { addonId: a.id != null ? String(a.id) : null, addonName: a.name || "Add-on", unitPrice: up, quantity: 1, totalPrice: up * qty };
        } catch { return null; }
    }).filter(Boolean);

    const addonsFromSchema = (row.schemaAddonsSelected || []).map((ex) => {
      const up = Number(ex.price || 0);
        return { addonId: ex.id != null ? String(ex.id) : null, addonName: ex.name || "Add-on", unitPrice: up, quantity: 1, totalPrice: up * qty };
      });

    return {
        productId: pid, productName: first?.title || "Item", productDescription: "",
        productImageUrl: Array.isArray(first?.images) && first.images[0] ? first.images[0] : "",
        categoryName: "", departmentName: "", unitPrice, quantity: qty,
        lineSubtotal: unitPrice * qty, lineTotal,
        notes: row.instructions || "", variants, addons: [...addonsFromExtra, ...addonsFromSchema],
    };
  });
}

  const emitOrderMessage = () => {
    const socket = getSocket();
    console.log('[Checkout] emitOrderMessage called, socket:', socket ? 'exists' : 'NULL', ', connected:', socket?.connected);
    if (socket) {
      socket.emit("order", "New order from app");
      console.log('[Checkout] Emitted "order" event to server');
    } else {
      console.log('[Checkout] FAILED - no socket available');
    }
  };

  const tryCreateOrder = async () => {
    try {
      const token = await retrieveTokenFromAsyncStorage();
      const row = cartItems.map((ci) => ({ ...ci, reviews: false }));
      const date = getTodaysDate();
      let instructions = cartItems.map((ci) => ci.instructions ?? "").join("\n").trim();

      const items = buildOrderItemsFromCart(cartItems, calculateTotalPrice);
      if (items.some((it) => !it.productId)) {
        Alert.alert("Checkout error", "We couldn't find products in your cart. Please try again.");
        return;
      }

      const orderPayload = {
        orderType: isPickup ? "pickup" : "delivery",
        status: "placed", paymentStatus: "paid", paymentMethod: "card",
        subtotal: totalOrderPrice, taxAmount: taxesAndFees, deliveryFee,
        discountAmount: promoDiscount, totalAmount: total,
        notes: [instructions, deliveryNotes].filter(Boolean).join("\n"),
        placedAt: date, items,
      };

      if (!isPickup && hasAddress) {
        const addr = address[0]?.address || "";
        orderPayload.deliveryAddress = { formattedAddress: addr, addressLine1: addr, city: "—" };
      }

      const createOrder = await axios.post(`${SERVER_URL}/api/v1/orders`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (createOrder) {
        const created = createOrder.data?.data?.order;
        const oid = created?._id || created?.id;
        lastOrderForReceipt.current.id = oid || generateRandomId(10);
        dispatch(completeOrder({
          id: {
            id: oid, order: row, date, status: "placed",
            address: isPickup ? "Pickup" : address[0]?.address || "",
            price: `$${total}`, driver: "",
            orderType: isPickup ? "Pickup" : "Delivery",
          },
        }));
        dispatch(clearCart({ id: cartItems }));
        emitOrderMessage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkOut = async () => {
    Keyboard.dismiss();
    try {
      const token = await retrieveTokenFromAsyncStorage();
      const response = await axios.post(`${SERVER_URL}/api/v1/payments/checkout-session`, { amount: total.toFixed(2) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { clientSecret, ephemeralKey, customer } = response.data || {};
      if (!clientSecret || !ephemeralKey || !customer) throw new Error(response.data?.message || "Could not start payment.");

      await initPaymentSheet({
        merchantDisplayName: "RoomService",
        paymentIntentClientSecret: clientSecret,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        returnURL: "room-service://payment-completed",
      });
  
      setIsLoading(true);
      const { error } = await presentPaymentSheet();
      if (error) { setIsLoading(false); setShowPaymentError(true); return; }

      lastOrderForReceipt.current = { items: [...cartItems], total, deliveryFee };
      setIsLoading(false);
      setVisible(true);
      tryCreateOrder();
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
      setShowPaymentError(true);
    }
  };
  
  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  function pressReceipt() {
    const { items, total: rTotal, id: oid, deliveryFee: df } = lastOrderForReceipt.current;
    navigation.navigate("Order Receipt", { total: (rTotal ?? total).toFixed(2), items: items?.length ? items : [...cartItems], id: oid || generateRandomId(10), deliveryFee: df ?? deliveryFee });
  }

  // ─── Helpers ───
  function isValidURL(str) {
    if (typeof str !== "string") str = String(str);
    return str.startsWith("http://") || str.startsWith("https://");
  }

  const fmtShort = (v) => { const n = Number(v); return n % 1 === 0 ? String(n) : n.toFixed(2); };

  // ─── Render ───
  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>        
  //       <ActivityIndicator size="large" color="#BC6C25" />
  //       <Text style={{ marginTop: 16, fontFamily: "Poppins-Medium", fontSize: 15, color: "#6B7280" }}>Processing payment…</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint="light" style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.35)", "transparent"]} style={styles.backHighlight} />
            <View style={styles.backIconWrap} pointerEvents="none">
              <Ionicons name="chevron-back" size={18} color="#111827" />
            </View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={styles.navTitleText} numberOfLines={1}>Checkout</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      {/* ── Alerts ── */}
      {showPaymentError && (
        <RoomServiceAlert type={ROOM_SERVICE_ALERT_TYPES.error} title="Something went wrong" message="We couldn't process your payment." primaryActionLabel="Try again" onPrimaryAction={() => setShowPaymentError(false)} dismissible onDismissed={() => setShowPaymentError(false)} />
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={0}>
      <ScrollView ref={scrollRef} style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">

        {/* ── Order type tabs ── */}
        <View style={styles.tabBar}>
          {["delivery", "pickup"].map((type) => (
            <Pressable key={type} onPress={() => setFulfillmentType(type)} style={[styles.tab, fulfillmentType === type && styles.tabActive]}>
              <Ionicons name={type === "delivery" ? "bicycle-outline" : "storefront-outline"} size={16} color={fulfillmentType === type ? "#BC6C25" : "#9CA3AF"} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, fulfillmentType === type && styles.tabTextActive]}>
                {type === "delivery" ? "Delivery" : "Pickup"}
          </Text>
        </Pressable>
          ))}
        </View>

        {/* ── Address / Map (delivery only) ── */}
        {!isPickup && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address details</Text>
            {hasAddress ? (
              <View style={styles.addressCard}>
                <View style={styles.mapWrap}>
                  {addressCoords ? (
                    <MapView
                      style={styles.map}
                      region={{ ...addressCoords, latitudeDelta: 0.006, longitudeDelta: 0.006 }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      customMapStyle={MAP_STYLE}
                    >
                      <Marker coordinate={addressCoords} />
                    </MapView>
                  ) : (
                    <View style={[styles.map, { alignItems: "center", justifyContent: "center", backgroundColor: "#EDEAE5" }]}>
                      <ActivityIndicator size="small" color="#BC6C25" />
                    </View>
                  )}
                </View>
                <Pressable style={styles.addressRow} onPress={() => navigation.navigate("Confirm Address")}>
                  <Ionicons name="location-outline" size={20} color="#374151" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.addressName} numberOfLines={1}>{address[0].name || "Home"}</Text>
                    <Text style={styles.addressDetail} numberOfLines={1}>{address[0].address}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.addAddressCard} onPress={() => navigation.navigate("Add Address")}>
                <View style={styles.addAddressIcon}>
                  <Ionicons name="location-outline" size={28} color="#BC6C25" />
                </View>
                <Text style={styles.addAddressTitle}>Add delivery address</Text>
                <Text style={styles.addAddressHint}>We need your address to deliver your order</Text>
                <View style={styles.addAddressBtn}>
                  <Ionicons name="add" size={18} color="#fff" />
                  <Text style={styles.addAddressBtnText}>Add address</Text>
                </View>
              </Pressable>
            )}
          </View>
        )}

        {/* ── Pickup info ── */}
        {isPickup && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup details</Text>
            <View style={styles.pickupCard}>
              <View style={styles.pickupIconWrap}>
                <Ionicons name="storefront-outline" size={28} color="#BC6C25" />
              </View>
              <Text style={styles.pickupTitle}>Order for pickup</Text>
              <Text style={styles.pickupHint}>We'll notify you when your order is ready to collect</Text>
            </View>
          </View>
        )}

        {/* ── Delivery time (delivery only) ── */}
        {!isPickup && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery time</Text>
            <View style={styles.modeRow}>
              {deliveryModes.map((m, idx) => (
                <Pressable key={idx} onPress={() => setNum(idx)} style={[styles.modeCard, num === idx && styles.modeCardActive]}>
                  <View style={styles.modeTop}>
                    <Ionicons name={m.icon} size={18} color={num === idx ? "#BC6C25" : "#6B7280"} />
                    <View style={[styles.modeRadio, num === idx && styles.modeRadioActive]}>
                      {num === idx && <View style={styles.modeRadioDot} />}
                    </View>
                  </View>
                  <Text style={[styles.modeLabel, num === idx && styles.modeLabelActive]}>{m.label}</Text>
                  <Text style={styles.modeTime}>{m.time}</Text>
                  <Text style={[styles.modeFee, m.fee === 0 && { color: "#16A34A" }]}>
                    {m.fee > 0 ? `+$${fmtShort(m.fee)}` : "Free"}
          </Text>
        </Pressable>
              ))}
      </View>
          </View>
        )}

        {/* ── Delivery notes (delivery only) ── */}
        {!isPickup && (
      <View
            style={styles.section}
            onLayout={(e) => { notesLayoutY.current = e.nativeEvent.layout.y; }}
          >
            <Pressable style={styles.notesToggle} onPress={() => setShowNotes((p) => !p)}>
              <MaterialCommunityIcons name="message-text-outline" size={18} color="#374151" />
              <Text style={styles.notesToggleText}>{showNotes ? "Hide" : "Add"} delivery notes</Text>
              <Ionicons name={showNotes ? "chevron-up" : "chevron-down"} size={16} color="#9CA3AF" />
          </Pressable>
            {showNotes && (
              <TextInput
                style={styles.notesInput}
                placeholder="E.g. Leave at door, ring bell..."
                placeholderTextColor="#9CA3AF"
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                multiline
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: notesLayoutY.current - 40, animated: true });
                  }, 300);
                }}
              />
            )}
            </View>
          )}

        {/* ── Order items ── */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Order items</Text>
            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 13, color: "#6B7280" }}>{totalCartCount} {totalCartCount === 1 ? "item" : "items"}</Text>
          </View>
          {cartItems.map((item, index) => {
            const product = item.products[0];
            const qty = item.products.length;
            const lineTotal = calculateTotalPrice(item);
            const imgSrc = product?.images?.[0];
            const extras = item.extra;
            const opts = item.options;
            const variants = item.variantSelections;
            const addons = item.schemaAddonsSelected;
            const instr = item.instructions;
            const comp = item.components;
            const hasDetails = (extras?.length > 0) || (opts?.some(o => o.values?.length > 0)) ||
              (variants?.some(v => v.selected?.length > 0)) || (addons?.length > 0) || instr;
            return (
              <Pressable key={index} style={styles.itemCard} onPress={() => handleProductClick(item, index)}>
                <AppImage uri={imgSrc && isValidURL(imgSrc) ? imgSrc : null} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {product?.title}
                    {comp ? <Text style={{ color: "#6B7280" }}>{` (${comp})`}</Text> : null}
              </Text>
                  <Text style={styles.itemMeta}>Qty: {qty}  ·  ${fmtShort(product?.price ?? 0)} each</Text>
                  {hasDetails && (
                    <View style={styles.itemExtras}>
                      {opts?.map((opt, i) =>
                        opt.values?.length > 0 ? (
                          <Text key={`o${i}`} style={styles.itemExtraText} numberOfLines={1}>
                            {opt.name}: {opt.values.map(v => v.name + (Number(v.price) > 0 ? ` (+$${fmtShort(v.price)})` : "")).join(", ")}
                          </Text>
                        ) : null
                      )}
                      {variants?.map((g, i) =>
                        g.selected?.length > 0 ? (
                          <Text key={`v${i}`} style={styles.itemExtraText} numberOfLines={1}>
                            {g.groupName}: {g.selected.map(s => s.name + (Number(s.priceDelta) > 0 ? ` (+$${fmtShort(s.priceDelta)})` : "")).join(", ")}
                          </Text>
                        ) : null
                      )}
                      {extras?.slice(0, 3).map((e, i) => (
                        <Text key={`e${i}`} style={styles.itemExtraText} numberOfLines={1}>
                          + {e.name}{Number(e.price) > 0 ? ` (+$${fmtShort(e.price)})` : ""}
                        </Text>
                      ))}
                      {addons?.slice(0, 3).map((a, i) => (
                        <Text key={`a${i}`} style={styles.itemExtraText} numberOfLines={1}>
                          + {a.name}{Number(a.price) > 0 ? ` (+$${fmtShort(a.price)})` : ""}
                        </Text>
                      ))}
                      {instr ? (
                        <Text style={[styles.itemExtraText, { fontStyle: "italic" }]} numberOfLines={1}>Note: {instr}</Text>
                      ) : null}
            </View>
          )}
           </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Pressable onPress={() => handleDeleteFromCart(index)} hitSlop={8} style={({ pressed }) => pressed && { opacity: 0.5 }}>
                    <Ionicons name="close-circle" size={22} color="#D1D5DB" />
                  </Pressable>
                  <Text style={styles.itemLineTotal}>${lineTotal.toFixed(2)}</Text>
                </View>
              </Pressable>
            );
          })}
      </View>

        {/* ── Promo row ── */}
        {promoDiscount > 0 && checkoutPromo && (
          <View style={styles.section}>
            <CheckoutPromoRow title={checkoutPromo.title || "Coupon"} subtitle={checkoutPromo.subtitle} amount={promoDiscount} />
      </View>
        )}

        {/* ── Price summary ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price summary</Text>
          <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${totalOrderPrice.toFixed(2)}</Text>
        </View>
            {!isPickup && (
        <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery fee</Text>
                <Text style={[styles.summaryValue, deliveryFee === 0 && { color: "#16A34A" }]}>
                  {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "Free"}
          </Text>
        </View>
            )}
        <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated tax</Text>
          <Text style={styles.summaryValue}>${taxesAndFees.toFixed(2)}</Text>
        </View>
            {promoDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: "#16A34A" }]}>-${promoDiscount.toFixed(2)}</Text>
      </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Place order bar ── */}
      <View style={[styles.placeOrderBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <View style={styles.placeOrderInfo}>
          <Text style={styles.placeOrderLabel}>{isPickup ? "Pickup" : "Delivery"} total</Text>
          <Text style={styles.placeOrderTotal}>${total.toFixed(2)}</Text>
        </View>
    <Pressable
          onPress={canOrder ? checkOut : () => {}}
          style={[styles.placeOrderBtn, !canOrder && { opacity: 0.45 }]}
        >
          <Ionicons name="bag-check-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.placeOrderBtnText}>Place order</Text>
    </Pressable>
      </View>

      {/* ── Success overlay ── */}
      {visible && (
        <Pressable onPress={() => navigation.navigate("HomeTabs")} style={styles.successOverlay}>
          <OrderSuccess onPress={pressReceipt} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  // Nav
  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 48, alignItems: "center" },
  navTitleCenter: { flex: 1, alignItems: "center" },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827" },
  backOuter: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: "50%", borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  backIconWrap: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },

  // Sections
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827", marginBottom: 10 },

  // Order type tabs
  tabBar: { flexDirection: "row", marginHorizontal: 16, marginTop: 12, backgroundColor: "#EDEAE5", borderRadius: 12, padding: 4 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 10 },
  tabActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  tabText: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#9CA3AF" },
  tabTextActive: { color: "#111827" },

  // Address card
  addressCard: { borderRadius: 16, overflow: "hidden", backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  mapWrap: { height: MAP_HEIGHT, overflow: "hidden" },
  map: { ...StyleSheet.absoluteFillObject },
  addressRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  addressName: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#111827" },
  addressDetail: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", marginTop: 1 },

  // Empty address
  addAddressCard: { alignItems: "center", padding: 28, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  addAddressIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(188,108,37,0.10)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  addAddressTitle: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827" },
  addAddressHint: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 4, marginBottom: 16 },
  addAddressBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#BC6C25", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20 },
  addAddressBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#fff" },

  // Pickup card
  pickupCard: { alignItems: "center", padding: 28, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  pickupIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(188,108,37,0.10)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  pickupTitle: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827" },
  pickupHint: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 4 },

  // Delivery modes
  modeRow: { flexDirection: "row", gap: 12 },
  modeCard: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "rgba(0,0,0,0.06)" },
  modeCardActive: { borderColor: "#BC6C25", backgroundColor: "rgba(188,108,37,0.04)" },
  modeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  modeRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  modeRadioActive: { borderColor: "#BC6C25" },
  modeRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#BC6C25" },
  modeLabel: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#374151" },
  modeLabelActive: { color: "#111827" },
  modeTime: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", marginTop: 2 },
  modeFee: { fontFamily: "Poppins-Medium", fontSize: 13, color: "#374151", marginTop: 4 },

  // Notes
  notesToggle: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  notesToggleText: { flex: 1, fontFamily: "Poppins-Medium", fontSize: 14, color: "#374151" },
  notesInput: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)", fontFamily: "Poppins-Regular", fontSize: 14, color: "#111827", minHeight: 64, textAlignVertical: "top" },

  // Order items
  itemCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.04)", marginBottom: 10 },
  itemImage: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#f3f1ed" },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  itemTitle: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#111827" },
  itemMeta: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#6B7280", marginTop: 2 },
  itemLineTotal: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#111827", marginTop: 8 },
  itemExtras: { marginTop: 4, gap: 2 },
  itemExtraText: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#6B7280" },

  // Price summary
  summaryCard: { padding: 16, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#6B7280" },
  summaryValue: { fontFamily: "Poppins-Medium", fontSize: 14, color: "#111827" },
  totalRow: { marginTop: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)", marginBottom: 0 },
  totalLabel: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827" },
  totalValue: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827" },

  // Place order bar
  placeOrderBar: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 14, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)", shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8 },
  placeOrderInfo: {},
  placeOrderLabel: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#6B7280" },
  placeOrderTotal: { fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#111827" },
  placeOrderBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(188,108,37,0.94)", borderRadius: 999, paddingVertical: 14, paddingHorizontal: 28, shadowColor: "#BC6C25", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
  placeOrderBtnText: { fontFamily: "Poppins-SemiBold", color: "#fff", fontSize: 16 },

  // Success overlay
  successOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", zIndex: 10, backgroundColor: "rgba(0,0,0,0.9)" },
});

export default CheckoutScreen;
