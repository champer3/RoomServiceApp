import {
  StyleSheet, View, Pressable, Dimensions, Image, Platform, AppState, SectionList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, updateOrder } from "../Data/order";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import RoomServiceAlert, { ROOM_SERVICE_ALERT_TYPES } from "../components/RoomServiceAlert";
import OrderDescription from "../components/OrderDescription";
import Text from "../components/Text";
import { useTheme } from "../theme/ThemeContext";

const { height: SH } = Dimensions.get("window");
const ACCENT = "#BC6C25";
const GREEN = "#283618";

function OrderDisplay() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const isTabScreen = route.name === "OrdersDefault";
  const orders = useSelector((state) => state.orders.ids);
  const ordersLoadStatus = useSelector((state) => state.orders.status);
  const [showOrderLoadError, setShowOrderLoadError] = useState(true);
  const [tab, setTab] = useState(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);
  useEffect(() => { if (ordersLoadStatus === "failed") setShowOrderLoadError(true); }, [ordersLoadStatus]);

  // Refetch when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        dispatch(fetchOrders());
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [dispatch]);

  const completedStatuses = useMemo(() => new Set(["Delivered", "Completed", "delivered", "completed", "picked_up"]), []);
  const cancelledStatuses = useMemo(() => new Set(["cancelled", "Cancelled", "canceled", "Canceled", "refunded", "Refunded"]), []);
  const isFinished = useCallback((s) => completedStatuses.has(s) || cancelledStatuses.has(s), [completedStatuses, cancelledStatuses]);

  const currentList = useMemo(() => {
    const filtered = orders.filter((o) => tab === 0 ? !isFinished(o.status) : isFinished(o.status));
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, tab, isFinished]);

  const sections = useMemo(() => {
    const grouped = {};
    currentList.forEach((order) => {
      const d = new Date(order.date);
      const now = new Date();
      let key;
      if (d.toDateString() === now.toDateString()) key = "Today";
      else {
        const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) key = "Yesterday";
        else key = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(order);
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [currentList]);

  const press = useCallback((item, id, price, date, deliveryFee, orderType, status) => {
    navigation.navigate("Order Receipt", { total: price, items: item, id, date, deliveryFee: deliveryFee ?? 0, orderType: orderType || "Delivery", status: status || "" });
  }, [navigation]);

  const handlePickedUp = useCallback((orderId) => {
    dispatch(updateOrder({ id: { uid: orderId, act: "status", perform: "picked_up" } }));
    setTimeout(() => dispatch(fetchOrders()), 1500);
  }, [dispatch]);

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      {isTabScreen ? (
        <View style={[styles.tabHeaderBlock, { paddingTop: insets.top }]}>
          <Text style={[styles.tabHeaderTitle, { color: colors.text }]}>Orders</Text>
          <Text style={[styles.tabHeaderSubtitle, { color: colors.textSecondary }]}>Track and review your purchases</Text>
        </View>
      ) : (
        <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
          <View style={styles.navSide}>
            <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
              <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
              <LinearGradient pointerEvents="none" colors={isDark ? ["rgba(30,30,30,0.78)", "rgba(30,30,30,0.52)", "rgba(30,30,30,0.44)"] : ["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
              <LinearGradient pointerEvents="none" colors={isDark ? ["rgba(255,255,255,0.08)", "transparent"] : ["rgba(255,255,255,0.35)", "transparent"]} style={styles.backHighlight} />
              <View style={styles.backIconWrap} pointerEvents="none"><Ionicons name="chevron-back" size={18} color={colors.text} /></View>
            </Pressable>
          </View>
          <View style={styles.navTitleCenter} pointerEvents="none">
            <Text style={[styles.navTitleText, { color: colors.text }]} numberOfLines={1}>Orders</Text>
          </View>
          <View style={styles.navSide} />
        </View>
      )}

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {[{ label: "Active", icon: "timer-outline" }, { label: "Completed", icon: "checkmark-circle-outline" }].map((item, i) => (
          <Pressable key={i} onPress={() => setTab(i)} style={[styles.tab, tab === i && styles.tabActive]}>
            <Ionicons name={item.icon} size={16} color={tab === i ? colors.accent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, tab === i && [styles.tabTextActive, { color: colors.accent }], { color: tab === i ? colors.accent : colors.textMuted }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {ordersLoadStatus === "failed" && showOrderLoadError && (
        <RoomServiceAlert type={ROOM_SERVICE_ALERT_TYPES.error} title="Could not load orders" message="Something went wrong." primaryActionLabel="Retry" onPrimaryAction={() => dispatch(fetchOrders())} dismissible onDismissed={() => setShowOrderLoadError(false)} />
      )}

      {currentList.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Image style={styles.emptyImage} source={require("../assets/empty.png")} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{tab === 0 ? "No active orders" : "No completed orders"}</Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Your orders will appear here</Text>
          <Pressable onPress={() => navigation.navigate("HomeTabs")} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Start shopping</Text>
          </Pressable>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={4}
          maxToRenderPerBatch={3}
          windowSize={5}
          removeClippedSubviews={Platform.OS === "android"}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionDate, { color: colors.textSecondary }]}>{title}</Text>
          )}
          renderItem={({ item: o }) => (
            <OrderDescription
              address={o.address}
              date={o.date}
              id={o.id}
              order={o.order}
              price={o.price}
              status={o.status}
              press={press}
              orderType={o.orderType}
              onPickedUp={handlePickedUp}
              driver={o.driver}
            />
          )}
        />
      )}
    </View>
  );
}

export default OrderDisplay;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  tabHeaderBlock: { paddingHorizontal: 18, marginBottom: 20 },
  tabHeaderTitle: { fontFamily: "Poppins-Bold", fontSize: 30, color: "#111827", letterSpacing: -0.5 },
  tabHeaderSubtitle: { fontFamily: "Poppins-Regular", fontSize: 15, color: "#6b7280", marginTop: 6, lineHeight: 22 },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 44, alignItems: "center", justifyContent: "center" },
  navTitleCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 17, color: "#111827", letterSpacing: 0.2 },
  backOuter: { width: 35, height: 35, borderRadius: 999, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)", shadowColor: "#1f2937", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 22, elevation: 14 },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: 12, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  backIconWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  tabRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 14, backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 12, padding: 3 },
  tab: { flex: 1, flexDirection: "row", paddingVertical: 10, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontFamily: "Poppins-Medium", fontSize: 14, color: "#9CA3AF" },
  tabTextActive: { color: "#111827", fontFamily: "Poppins-SemiBold" },

  sectionDate: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#6B7280", marginTop: 16, marginBottom: 8 },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 8, paddingBottom: 80 },
  emptyImage: { height: SH / 4, resizeMode: "contain", alignSelf: "center", marginBottom: 8 },
  emptyTitle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827", textAlign: "center" },
  emptyHint: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#9CA3AF", textAlign: "center" },
  emptyBtn: { backgroundColor: GREEN, borderRadius: 999, paddingVertical: 13, paddingHorizontal: 32, marginTop: 12 },
  emptyBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#fff" },
});
