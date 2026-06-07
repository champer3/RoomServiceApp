import {
  StyleSheet, View, Pressable, ScrollView, Platform, Dimensions, Animated, LayoutAnimation, UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/Text";
import { loadNotifications, clearNotifications, resetUnreadCount } from "../Data/notify";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACCENT = "#BC6C25";
const GREEN = "#283618";

function getNotificationIcon(notification) {
  const body = (notification?.request?.content?.body || "").toLowerCase();
  if (body.includes("delivered")) return { name: "checkmark-circle", color: "#16a34a" };
  if (body.includes("delivery") || body.includes("out for")) return { name: "bicycle", color: ACCENT };
  if (body.includes("ready")) return { name: "restaurant", color: "#7c3aed" };
  if (body.includes("confirmed") || body.includes("placed")) return { name: "receipt", color: "#2563eb" };
  if (body.includes("preparing")) return { name: "flame", color: "#ea580c" };
  return { name: "notifications", color: "#6B7280" };
}

function formatTimeOnly(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function NotificationItem({ notification, isLast }) {
  const content = notification?.request?.content;
  const icon = getNotificationIcon(notification);
  const time = formatTimeOnly(notification?.date);

  if (!content) return null;

  return (
    <View style={[styles.notifCard, !isLast && styles.notifCardBorder]}>
      <View style={[styles.iconCircle, { backgroundColor: icon.color + "14" }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifTopRow}>
          <Text style={styles.notifTitle} numberOfLines={1}>{content.title || "Notification"}</Text>
          {time ? <Text style={styles.notifTime}>{time}</Text> : null}
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{content.body || ""}</Text>
      </View>
    </View>
  );
}

function CollapsibleGroup({ label, count, notifications, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.groupContainer}>
      <Pressable onPress={toggle} style={styles.groupHeader} hitSlop={4}>
        <View style={styles.groupHeaderLeft}>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </Animated.View>
          <Text style={styles.groupLabel}>{label}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.groupContent}>
          {notifications.map((n, i) => (
            <NotificationItem
              key={`${label}-${i}`}
              notification={n}
              isLast={i === notifications.length - 1}
            />
          ))}
        </View>
      )}

      {!expanded && notifications.length > 0 && (
        <Pressable onPress={toggle} style={styles.collapsedPreview}>
          <View style={styles.stackedCards}>
            <View style={[styles.stackCard, styles.stackCard3]} />
            <View style={[styles.stackCard, styles.stackCard2]} />
            <View style={[styles.stackCard, styles.stackCard1]}>
              <View style={[styles.iconCircleSmall, { backgroundColor: getNotificationIcon(notifications[0]).color + "14" }]}>
                <Ionicons name={getNotificationIcon(notifications[0]).name} size={18} color={getNotificationIcon(notifications[0]).color} />
              </View>
              <Text style={styles.previewText} numberOfLines={1}>
                {notifications[0]?.request?.content?.body || "Notification"}
              </Text>
            </View>
          </View>
          <Text style={styles.moreText}>
            {count > 1 ? `${count - 1} more notification${count > 2 ? "s" : ""}` : ""}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function NotificationsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const notifications = useSelector((state) => state.notifications.notification);

  useEffect(() => {
    dispatch(loadNotifications());
    dispatch(resetUnreadCount());
  }, [dispatch]);

  const sortedNotifications = [...(notifications || [])].reverse();

  // Group by date
  const groups = {};
  sortedNotifications.forEach((n) => {
    const dateKey = n?.date ? new Date(n.date).toDateString() : "Unknown";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(n);
  });

  const today = new Date().toDateString();
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  const handleClear = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint="light" style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.35)", "transparent"]} style={styles.backHighlight} />
            <View style={styles.backIconWrap} pointerEvents="none"><Ionicons name="chevron-back" size={18} color="#111827" /></View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={styles.navTitleText} numberOfLines={1}>Notifications</Text>
        </View>
        <View style={styles.navSide}>
          {sortedNotifications.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={8}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
        </View>
      </View>

      {sortedNotifications.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyHint}>You'll be notified when there's an update on your orders</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
          {sortedGroupKeys.map((dateKey) => (
            <CollapsibleGroup
              key={dateKey}
              label={formatDateLabel(dateKey)}
              count={groups[dateKey].length}
              notifications={groups[dateKey]}
              defaultExpanded={dateKey === today}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 44, alignItems: "center", justifyContent: "center" },
  navTitleCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 17, color: "#111827", letterSpacing: 0.2 },
  backOuter: { width: 35, height: 35, borderRadius: 999, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)", shadowColor: "#1f2937", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 22, elevation: 14 },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: 12, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  backIconWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  clearText: { fontFamily: "Poppins-Medium", fontSize: 13, color: ACCENT },

  // Group styles
  groupContainer: { marginBottom: 16 },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  groupHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  groupLabel: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#1f2937" },
  countBadge: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  countText: { fontFamily: "Poppins-Medium", fontSize: 12, color: "#4B5563" },

  // Expanded notification items
  groupContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  notifCard: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  notifCardBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notifContent: { flex: 1, justifyContent: "center" },
  notifTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  notifTitle: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#111827", flex: 1 },
  notifBody: { fontFamily: "Poppins-Regular", fontSize: 12.5, color: "#4B5563", lineHeight: 17 },
  notifTime: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#9CA3AF", marginLeft: 8 },

  // Collapsed preview (stacked cards)
  collapsedPreview: { alignItems: "center", paddingTop: 4 },
  stackedCards: { width: "100%", height: 64, position: "relative", marginBottom: 4 },
  stackCard: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  stackCard1: {
    top: 0,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  stackCard2: { top: 5, left: 6, right: 6, zIndex: 2, opacity: 0.7 },
  stackCard3: { top: 10, left: 12, right: 12, zIndex: 1, opacity: 0.4 },
  iconCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  previewText: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#4B5563", flex: 1 },
  moreText: { fontFamily: "Poppins-Medium", fontSize: 12, color: "#9CA3AF", marginTop: 8 },

  // Empty state
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, paddingBottom: 80 },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827", textAlign: "center", marginBottom: 6 },
  emptyHint: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#9CA3AF", textAlign: "center", lineHeight: 20 },
});
