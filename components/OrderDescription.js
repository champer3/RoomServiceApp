import { StyleSheet, View, Pressable, ScrollView, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Octicons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import Text from "./Text";
import AppImage from "./AppImage";
import FlexButton from "./Buttons/FlexButton";
import { getAddress, getPosition, getDuration } from "../util/location";
import { cartLineTotal } from "../utils/productCartForm";
import { MAP_STYLE } from "../utils/mapStyle";

const ACCENT = "#BC6C25";
const GREEN = "#283618";

function groupOrderItems(order) {
  const map = new Map();
  for (const item of order) {
    const product = item.products?.[0];
    const title = product?.title || "";
    const image = product?.images?.[0] || "";
    const hasCustom = (item.extra?.length || 0) > 0 ||
      (item.options || []).some((o) => (o.values?.length || 0) > 0) ||
      (item.variantSelections || []).some((g) => (g.selected?.length || 0) > 0) ||
      (item.schemaAddonsSelected?.length || 0) > 0 ||
      (item.components && String(item.components).trim()) ||
      (item.instructions && String(item.instructions).trim());
    const key = hasCustom ? `${title}__${Math.random()}` : title;
    const qty = item.products?.length || 1;
    if (map.has(key)) {
      map.get(key).count += qty;
    } else {
      map.set(key, { image, count: qty });
    }
  }
  return Array.from(map.values());
}

function OrderDescription({ address, date, id, order, price, status = "Ordered", press, onPickedUp, orderType = "Delivery", driver: driverInfo }) {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [time, setTime] = useState();
  const [position, setPosition] = useState(null);
  const [driver, setDriver] = useState(null);

  const normalizedStatus = (status || "").toLowerCase();
  const isPickupOrder = (orderType || "").toLowerCase() === "pickup";
  const isReadyForPickup = normalizedStatus === "ready for pickup" || normalizedStatus === "ready for pick up" || normalizedStatus === "ready";
  const isCancelled = normalizedStatus === "cancelled" || normalizedStatus === "canceled" || normalizedStatus === "refunded";
  const isCompleted = normalizedStatus === "delivered" || normalizedStatus === "completed" || (isPickupOrder && normalizedStatus === "picked_up");
  const isOutForDelivery = !isPickupOrder && (normalizedStatus === "assigned" || normalizedStatus === "out for delivery" || status === "Out for Delivery");

  const statuses = isPickupOrder
    ? ["Ordered", "Ready for Pickup", "Picked Up"]
    : ["Ordered", "Ready for\nDelivery", "Out for\nDelivery", "Delivered"];

  const mapStatusToTimeline = (raw) => {
    const s = String(raw || "").toLowerCase();
    if (isPickupOrder) {
      if (s === "placed" || s === "ordered" || s === "preparing") return "Ordered";
      if (s === "ready" || s === "ready for pickup" || s === "ready for delivery") return "Ready for Pickup";
      if (s === "picked_up" || s === "delivered" || s === "completed") return "Picked Up";
      return "Ordered";
    }
    if (s === "placed" || s === "ordered" || s === "preparing") return "Ordered";
    if (s === "ready" || s === "ready for delivery" || s === "ready for pickup") return "Ready for\nDelivery";
    if (s === "assigned" || s === "picked_up" || s === "out for delivery") return "Out for\nDelivery";
    if (s === "delivered" || s === "completed") return "Delivered";
    return typeof raw === "string" && raw ? raw : "Ordered";
  };

  const timelineStatus = mapStatusToTimeline(status);
  const currentStatusIndex = Math.max(0, statuses.indexOf(timelineStatus));
  const totalItems = order.reduce((s, item) => s + (item.products?.length || 1), 0);

  const totalPrice = order.reduce((s, item) => s + cartLineTotal(item), 0);
  const displayPrice = `$${totalPrice.toFixed(2)}`;

  useEffect(() => {
    if (isCompleted || isCancelled) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isCompleted, isCancelled, pulseAnim]);

  useEffect(() => {
    if (!isOutForDelivery) return;
    (async () => {
      const loc = await getPosition(address);
      if (loc?.lat) setPosition({ latitude: loc.lat, longitude: loc.lng });
    })();
  }, [address, isOutForDelivery]);

  useEffect(() => {
    if (!isOutForDelivery) return;
    (async () => {
      const loc = await getPosition("501 Main Street Nashville, TN 37206");
      if (loc?.lat) setDriver({ latitude: loc.lat, longitude: loc.lng });
    })();
  }, [isOutForDelivery]);

  useEffect(() => {
    if (!isOutForDelivery || !position || !driver) return;
    getDuration(`${position.latitude},${position.longitude}`, `${driver.latitude},${driver.longitude}`)
      .then((c) => setTime(c))
      .catch(() => {});
  }, [position, driver, isOutForDelivery]);

  function getTimeLeft(d, dur) {
    const mins = parseInt(dur);
    const left = mins * 60000 - (Date.now() - new Date(d).getTime());
    if (left <= 0) return "Running late";
    return `${Math.floor(left / 60000)} min away`;
  }

  function formatRelativeDate(dateString) {
    const d = new Date(dateString);
    const now = new Date();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const prefix = isCancelled ? "Cancelled" : isCompleted ? (isPickupOrder ? "Picked up" : "Delivered") : "Ordered";
    if (d.toDateString() === now.toDateString()) return `${prefix} today at ${hh}:${mm}`;
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return `${prefix} yesterday`;
    const mon = new Intl.DateTimeFormat("en-US", { month: "short" }).format(d);
    return `${prefix} on ${mon} ${d.getDate()}`;
  }

  function formatDriverName(raw) {
    if (!raw) return null;
    const str = typeof raw === "object" ? (raw.name || raw.firstName || "") : String(raw);
    if (!str) return null;
    if (str.includes("@")) {
      const local = str.split("@")[0];
      return local
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
    }
    return str.replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  }

  function pressHandler() {
    const name = formatDriverName(driverInfo);
    const phone = typeof driverInfo === "object" && driverInfo?.phone ? driverInfo.phone : null;
    const driverParam = name ? { driverName: name, driverPhone: phone, assigned: true } : {};
    navigation.navigate("Delivery Status", { address, ...driverParam });
  }

  if (isCancelled) {
    return (
      <View style={styles.cancelledCard}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{formatRelativeDate(date)}</Text>
          <Text style={[styles.priceText, { textDecorationLine: "line-through", color: "#9CA3AF" }]}>{displayPrice}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.itemCount}>{totalItems} {totalItems > 1 ? "Items" : "Item"}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, paddingBottom: 10, marginBottom: -4 }}>
          {groupOrderItems(order).map((g, idx) => (
            <View key={idx} style={[styles.thumbWrap, { opacity: 0.5 }]}>
              <AppImage uri={g.image} style={styles.thumb} resizeMode="cover" />
              {g.count > 1 && (
                <View style={styles.thumbBadge}>
                  <Text style={styles.thumbBadgeText}>{g.count}x</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          <Pressable onPress={() => press(order, id, displayPrice, date, undefined, orderType, status)} style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View order</Text>
            <Ionicons name="chevron-forward" size={14} color="#6B7280" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header: date + price */}
      <View style={styles.headerRow}>
        <Text style={styles.dateText}>{formatRelativeDate(date)}</Text>
        <Text style={styles.priceText}>{displayPrice}</Text>
      </View>

      {/* Timeline */}
      <View style={styles.timelineRow}>
        {statuses.map((step, idx) => {
          const isLast = idx === statuses.length - 1;
          const isDone = idx < currentStatusIndex;
          const isCurrent = idx === currentStatusIndex;
          return (
            <React.Fragment key={`${step}-${idx}`}>
              <View style={styles.dotContainer}>
                {isLast && isCompleted ? (
                  <Ionicons name="checkmark-circle" size={20} color={ACCENT} />
                ) : isCurrent && !isCompleted ? (
                  <>
                    <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
                    <View style={styles.currentDot} />
                  </>
                ) : (
                  <View style={[styles.dot, isDone || isCurrent ? styles.dotDone : styles.dotPending]} />
                )}
              </View>
              {!isLast && (
                <View style={[styles.timelineLine, idx < currentStatusIndex ? styles.lineDone : styles.linePending]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        {statuses.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === statuses.length - 1;
          return (
            <Text
              key={`label-${idx}`}
              style={[
                styles.stepLabel,
                idx === currentStatusIndex && !isCompleted && styles.stepLabelActive,
                isFirst && { textAlign: "left" },
                isLast && { textAlign: "right" },
              ]}
              numberOfLines={2}
            >{step}</Text>
          );
        })}
      </View>

      {/* Map preview for out-for-delivery */}
      {isOutForDelivery && position && (
        <Pressable onPress={pressHandler} style={styles.mapPreviewWrap}>
          <MapView
            style={styles.mapPreview}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            pointerEvents="none"
            customMapStyle={MAP_STYLE}
            initialRegion={{
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
          >
            <Marker coordinate={position}>
              <View style={styles.pinMarker}>
                <Ionicons name="location" size={20} color="#fff" />
              </View>
            </Marker>
            {driver && (
              <Marker coordinate={driver}>
                <View style={styles.driverMarker}>
                  <Ionicons name="bicycle" size={16} color="#fff" />
                </View>
              </Marker>
            )}
          </MapView>
          <View style={styles.mapOverlay}>
            <View style={styles.mapOverlayContent}>
              {time && (
                <Text style={styles.mapEta}>
                  <Ionicons name="bicycle-outline" size={14} color={"white"} />{" "}
                  {getTimeLeft(date, time)}
                </Text>
              )}
              <View style={styles.mapTrackRow}>
                <Text style={styles.mapTrackText}>Track order</Text>
                <Ionicons name="chevron-forward" size={14} color="#fff" />
              </View>
            </View>
          </View>
        </Pressable>
      )}

      <View style={styles.divider} />

      {/* Item count + thumbnails */}
      <Text style={styles.itemCount}>{totalItems} {totalItems > 1 ? "Items" : "Item"}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, paddingBottom: 10, marginBottom: -4 }}>
        {groupOrderItems(order).map((g, idx) => (
          <View key={idx} style={styles.thumbWrap}>
            <AppImage uri={g.image} style={styles.thumb} resizeMode="cover" />
            {g.count > 1 && (
              <View style={styles.thumbBadge}>
                <Text style={styles.thumbBadgeText}>{g.count}x</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionRow}>
        {isPickupOrder && isReadyForPickup && (
          <Pressable onPress={() => onPickedUp?.(id)} style={styles.pickupBtn}>
            <Ionicons name="bag-check-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.pickupBtnText}>Picked Up</Text>
          </Pressable>
        )}
        <Pressable onPress={() => press(order, id, displayPrice, date, undefined, orderType, status)} style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View order</Text>
          <Ionicons name="chevron-forward" size={14} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(OrderDescription);

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cancelledCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(239,68,68,0.15)", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  dateText: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280" },
  priceText: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#111827" },

  timelineRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dotContainer: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotDone: { backgroundColor: ACCENT },
  dotPending: { backgroundColor: "#D1D5DB" },
  currentDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT, position: "absolute" },
  pulseRing: { width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(188,108,37,0.25)", position: "absolute" },
  timelineLine: { flex: 1, height: 2, marginHorizontal: -5 },
  lineDone: { backgroundColor: ACCENT },
  linePending: { backgroundColor: "#E5E7EB" },
  labelRow: { flexDirection: "row", marginBottom: 10 },
  stepLabel: { fontSize: 10, fontFamily: "Poppins-Regular", color: "#9CA3AF", textAlign: "center", flex: 1 },
  stepLabelActive: { color: ACCENT, fontFamily: "Poppins-Medium" },

  mapPreviewWrap: { borderRadius: 14, overflow: "hidden", marginBottom: 4, height: 130 },
  mapPreview: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  mapOverlayContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)", paddingHorizontal: 12, paddingVertical: 8 },
  mapEta: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#fff" },
  mapTrackRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  mapTrackText: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#fff" },
  pinMarker: { width: 32, height: 32, borderRadius: 16, backgroundColor: ACCENT, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  driverMarker: { width: 28, height: 28, borderRadius: 14, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },

  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginVertical: 10 },

  itemCount: { fontFamily: "Poppins-Medium", fontSize: 13, color: "#374151" },
  thumbWrap: { marginRight: 12 },
  thumb: { width: 50, height: 50, borderRadius: 14, backgroundColor: "#EDEAE5" },
  thumbBadge: { position: "absolute", top: -2, right: 0, alignItems: "center", justifyContent: "center" },
  thumbBadgeText: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: "#111827" },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  pickupBtn: { flexDirection: "row", alignItems: "center", backgroundColor: GREEN, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18 },
  pickupBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#fff" },
  viewBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4 },
  viewBtnText: { fontFamily: "Poppins-Medium", fontSize: 13, color: "#6B7280" },
});
