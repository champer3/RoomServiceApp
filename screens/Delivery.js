import {
  StyleSheet, View, Pressable, Dimensions, Platform, ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getPosition, getDirections, getDuration } from "../util/location";
import { MAP_STYLE } from "../utils/mapStyle";
import Text from "../components/Text";

const ACCENT = "#BC6C25";
const GREEN = "#283618";

export default function Delivery() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const address = route.params?.address || "";
  const driverName = route.params?.driverName || null;

  const [position, setPosition] = useState(null);
  const [driver, setDriver] = useState(null);
  const [coords, setCoords] = useState([]);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loc = await getPosition(address);
      if (loc?.lat) setPosition({ latitude: loc.lat, longitude: loc.lng });
    })();
  }, [address]);

  useEffect(() => {
    (async () => {
      const loc = await getPosition("501 Main Street Nashville, TN 37206");
      if (loc?.lat) setDriver({ latitude: loc.lat, longitude: loc.lng });
    })();
  }, []);

  useEffect(() => {
    if (!position || !driver) return;
    getDirections(`${position.latitude},${position.longitude}`, `${driver.latitude},${driver.longitude}`)
      .then((c) => { setCoords(c); setLoading(false); })
      .catch(() => setLoading(false));
    getDuration(`${position.latitude},${position.longitude}`, `${driver.latitude},${driver.longitude}`)
      .then((t) => setEta(t))
      .catch(() => {});
  }, [position, driver]);

  useEffect(() => {
    if (position && driver && mapRef.current) {
      mapRef.current.fitToCoordinates([position, driver], {
        edgePadding: { top: 100, right: 50, bottom: 340, left: 50 },
        animated: true,
      });
    }
  }, [position, driver]);

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  function focusDeliveryAddress() {
    if (!position || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: position.latitude,
      longitude: position.longitude,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    }, 600);
  }

  function shortenAddress(addr) {
    if (!addr) return "Your location";
    const parts = addr.split(",").map((p) => p.trim());
    if (parts.length <= 2) return addr;
    return parts.slice(0, 2).join(", ");
  }

  function getEtaText() {
    if (!eta) return "Calculating...";
    const mins = parseInt(eta);
    if (isNaN(mins)) return eta;
    if (mins < 5) return "< 5 min";
    const lo = Math.floor(mins / 5) * 5;
    const hi = lo + 5;
    return `${lo}-${hi} min`;
  }

  return (
    <View style={styles.container}>
      {position ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          customMapStyle={MAP_STYLE}
          initialRegion={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={false}
          showsCompass={false}
        >
          {/* Delivery address pin */}
          <Marker coordinate={position} anchor={{ x: 0.5, y: 0.85 }}>
            <View style={styles.destPin}>
              <View style={styles.destPinOuter}>
                <View style={styles.destPinInner}>
                  <Ionicons name="location" size={26} color="#fff" />
                </View>
              </View>
              {/* <View style={styles.destPinTail} /> */}
            </View>
          </Marker>

          {/* Driver pin */}
          {driver && (
            <Marker coordinate={driver} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.driverPinOuter}>
                <View style={styles.driverPinInner}>
                  <Ionicons name="bicycle" size={16} color={ACCENT} />
                </View>
              </View>
            </Marker>
          )}

          {coords.length > 0 && (
            <Polyline coordinates={coords} strokeWidth={2.5} strokeColor={ACCENT} />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}

      {/* Header: back + locate */}
      <View style={[styles.headerRow, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={goBack} style={styles.headerBtn} hitSlop={8}>
          <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint="light" style={StyleSheet.absoluteFillObject} />
          <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.headerBtnIcon} pointerEvents="none">
            <Ionicons name="chevron-back" size={18} color="#111827" />
          </View>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable onPress={focusDeliveryAddress} style={styles.headerBtn} hitSlop={8}>
          <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint="light" style={StyleSheet.absoluteFillObject} />
          <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.headerBtnIcon} pointerEvents="none">
            <Ionicons name="locate-outline" size={18} color="#111827" />
          </View>
        </Pressable>
      </View>

      {/* Bottom floating card */}
      <View style={[styles.infoCard, { marginBottom: insets.bottom + 12 }]}>
        <View style={styles.infoHandle} />

        {/* ETA */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconCircle}>
            <Ionicons name="time-outline" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.infoValue}>{getEtaText()}</Text>
            <Text style={styles.infoLabel}>Delivery time</Text>
          </View>
          {loading && <ActivityIndicator size="small" color={ACCENT} />}
        </View>

        <View style={styles.infoDivider} />

        {/* Address */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconCircle}>
            <Ionicons name="location-outline" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.infoValue} numberOfLines={1}>{shortenAddress(address)}</Text>
            <Text style={styles.infoLabel}>Delivery address</Text>
          </View>
        </View>

        {/* Driver */}
        {driver && (
          <>
            <View style={{ height: 12 }} />
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.driverName}>{driverName || "Your courier"}</Text>
                <Text style={styles.driverRole}>Courier</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f0" },

  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontFamily: "Poppins-Medium", fontSize: 14, color: "#6B7280" },

  headerRow: { position: "absolute", left: 0, right: 0, zIndex: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  headerBtn: { width: 38, height: 38, borderRadius: 999, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)", shadowColor: "#1f2937", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 10 },
  headerBtnIcon: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  destPin: { alignItems: "center" },
  destPinOuter: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(188,108,37,0.18)", alignItems: "center", justifyContent: "center" },
  destPinInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: ACCENT, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  destPinTail: { width: 3, height: 14, backgroundColor: ACCENT, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, marginTop: -2 },

  driverPinOuter: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(40,54,24,0.15)", alignItems: "center", justifyContent: "center" },
  driverPinInner: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: ACCENT, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },

  infoCard: { position: "absolute", bottom: 0, left: 28, right: 28, backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 24, paddingTop: 10,  shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 14 },
  infoHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.25)", alignSelf: "center", marginBottom: 14 },

  infoRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18 },
  infoIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: ACCENT, alignItems: "center", justifyContent: "center" },
  infoValue: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "black" },
  infoLabel: { fontFamily: "Poppins-Regular", fontSize: 12, color: "black", marginTop: 1 },

  infoDivider: { height: 0, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 12, marginHorizontal: 18 },
  driverCard: { flexDirection: "row", alignItems: "center", backgroundColor: ACCENT, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, padding: 18 , marginTop: 12, marginBottom: 1, marginHorizontal: 2
  },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  
  driverRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, marginTop: 12 },
  driverAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  driverName: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#fff" },
  driverRole: { fontFamily: "Poppins-Regular", fontSize: 12, color: "rgba(255,255,255,0.55)" },
});
