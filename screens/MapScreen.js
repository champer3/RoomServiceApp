import {
  StyleSheet, View, Dimensions, Platform, Keyboard, Pressable,
  ScrollView, ActivityIndicator, TextInput, Animated, KeyboardAvoidingView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getAddress, getPosition, searchAddress } from "../util/location";
import { MAP_STYLE } from "../utils/mapStyle";
import { syncAddresses } from "../api/syncService";

const { height: SH } = Dimensions.get("window");
const MAP_MIN = 180;
const MAP_MAX = Math.round(SH * 0.55);

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const data = useSelector((s) => s.profileData.profile);

  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [results, setResults] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [form, setForm] = useState(route.params ? { ...route.params } : { name: "", address: "", nameNo: "", number: "", id: 0 });
  const mapRef = useRef(null);
  const suggestionTimeout = useRef(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const mapHeight = useRef(new Animated.Value(MAP_MIN)).current;

  function toggleMap() {
    const next = !mapExpanded;
    setMapExpanded(next);
    Animated.spring(mapHeight, { toValue: next ? MAP_MAX : MAP_MIN, useNativeDriver: false, friction: 10, tension: 60 }).start();
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const addr = route.params?.address;
      if (!addr) { setPosition({ latitude: 37.78825, longitude: -122.4324 }); return; }
      const loc = await getPosition(addr);
      if (cancelled) return;
      if (loc?.lat) setPosition({ latitude: loc.lat, longitude: loc.lng });
      else setPosition({ latitude: 37.78825, longitude: -122.4324 });
    })();
    return () => { cancelled = true; };
  }, [route.params?.address]);

  function handleFormChange(field, value) {
    if (field === "number") {
      const clean = value.replace(/\D/g, "");
      let fmt = "";
      for (let i = 0; i < clean.length; i++) {
        if (i === 0) fmt += "(";
        else if (i === 3) fmt += ") ";
        else if (i === 6) fmt += "-";
        fmt += clean[i];
      }
      value = fmt;
    } else if (field === "address") {
      setSaveError(null);
      if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
      if ((value || "").trim().length >= 2) {
        suggestionTimeout.current = setTimeout(async () => {
          const r = await searchAddress(value);
          setResults(Array.isArray(r) ? r : []);
        }, 300);
      } else setResults([]);
    }
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function selectSuggestion(addr) {
    setForm((p) => ({ ...p, address: addr }));
    setResults([]);
    Keyboard.dismiss();
    const pos = await getPosition(addr);
    if (pos?.lat) {
      setPosition({ latitude: pos.lat, longitude: pos.lng });
      setTimeout(() => mapRef.current?.animateToRegion({ latitude: pos.lat, longitude: pos.lng, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 350), 100);
    }
  }

  function selectLocationHandler(e) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPosition({ latitude, longitude });
    (async () => {
      const addr = await getAddress(latitude, longitude);
      if (addr) setForm((p) => ({ ...p, address: addr }));
    })();
  }

  async function findMyLocation() {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const addr = await getAddress(latitude, longitude);
      if (addr) setForm((p) => ({ ...p, address: addr }));
      setPosition({ latitude, longitude });
      mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 350);
    } catch (e) { console.warn(e?.message); }
  }

  function makeDefault(id) {
    const addresses = data?.address || [];
    const newData = { ...data, address: [{ ...addresses[id], id: 0 }] };
    let j = 1;
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].id !== id) { newData.address.push({ ...addresses[i], id: j }); j++; }
    }
    dispatch(updateProfile({ id: newData }));
    return newData;
  }

  async function validateAndSave() {
    setSaveError(null);
    if (!(form.address || "").trim()) { setSaveError("Please enter an address."); return; }
    setIsLoading(true);
    const loc = await getPosition(form.address);
    if (!loc?.lat) { setIsLoading(false); setSaveError("Address not found. Try a suggestion."); return; }
    const resolved = (await getAddress(loc.lat, loc.lng)) || form.address;
    setPosition({ latitude: loc.lat, longitude: loc.lng });
    const addresses = data?.address || [];
    const newData = { ...data, address: [] };
    for (let i = 0; i < addresses.length; i++) {
      newData.address.push(i === form.id ? { ...form, address: resolved } : addresses[i]);
    }
    dispatch(updateProfile({ id: newData }));
    let finalData = newData;
    if (active) { finalData = makeDefault(form.id); }
    syncAddresses(finalData.address).catch(() => {});
    setIsLoading(false);
    navigation.navigate("Address");
  }

  function deleteAndUpdate() {
    const addresses = data?.address || [];
    const newData = { ...data, address: addresses.filter((_, i) => i !== form.id).map((a, i) => ({ ...a, id: i })) };
    dispatch(updateProfile({ id: newData }));
    syncAddresses(newData.address).catch(() => {});
    navigation.navigate("Address");
  }

  function goBack() { navigation.canGoBack() ? navigation.goBack() : navigation.navigate("HomeTabs"); }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#BC6C25" />
        <Text style={styles.loadingText}>Saving…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header */}
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
          <Text style={styles.navTitleText} numberOfLines={1}>Edit Address</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Map card -- expandable */}
        <Animated.View style={[styles.mapCard, { height: mapHeight }]}>
          {position ? (
            <MapView ref={mapRef} style={StyleSheet.absoluteFillObject} initialRegion={{ ...position, latitudeDelta: 0.005, longitudeDelta: 0.005 }} onPress={(e) => { selectLocationHandler(e); Keyboard.dismiss(); }} customMapStyle={MAP_STYLE}>
              <Marker coordinate={position}>
                <View style={styles.customPin}><Ionicons name="location" size={20} color="#fff" /></View>
                <View style={styles.pinTail} />
              </Marker>
            </MapView>
          ) : (
            <View style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "center", backgroundColor: "#EDEAE5" }]}>
              <ActivityIndicator size="small" color="#BC6C25" />
            </View>
          )}
          <Pressable style={styles.myLocBtn} onPress={() => { findMyLocation(); Keyboard.dismiss(); }}>
            <Ionicons name="locate-outline" size={20} color="#BC6C25" />
          </Pressable>
          <Pressable style={styles.expandBtn} onPress={toggleMap} hitSlop={6}>
            <Ionicons name={mapExpanded ? "chevron-up" : "chevron-down"} size={18} color="#374151" />
          </Pressable>
        </Animated.View>

        <Text style={styles.fieldLabel}>Address name</Text>
        <TextInput style={styles.input} placeholder="e.g. Home, Work" placeholderTextColor="#9CA3AF" value={form.name} onChangeText={(v) => handleFormChange("name", v)} />

        <Text style={styles.fieldLabel}>Street address</Text>
        <View style={styles.addressInputRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Start typing…" placeholderTextColor="#9CA3AF" value={form.address} onChangeText={(v) => handleFormChange("address", v)} />
          <Pressable style={styles.locateSmall} onPress={() => { findMyLocation(); Keyboard.dismiss(); }}>
            <Ionicons name="navigate" size={16} color="#BC6C25" />
          </Pressable>
        </View>
        {results.length > 0 && (
          <View style={styles.suggestionsWrap}>
            {results.slice(0, 4).map((addr, i) => (
              <Pressable key={i} style={styles.suggestionRow} onPress={() => selectSuggestion(addr)}>
                <Ionicons name="location-outline" size={18} color="#6B7280" />
                <Text style={styles.suggestionText} numberOfLines={1}>{addr}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

        <Text style={styles.fieldLabel}>Contact name</Text>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#9CA3AF" value={form.nameNo} onChangeText={(v) => handleFormChange("nameNo", v)} />

        <Text style={styles.fieldLabel}>Phone number</Text>
        <TextInput style={styles.input} placeholder="(555) 123-4567" placeholderTextColor="#9CA3AF" value={form.number} onChangeText={(v) => handleFormChange("number", v)} keyboardType="number-pad" maxLength={14} />

        <Pressable style={styles.checkRow} onPress={() => setActive((p) => !p)}>
          <View style={[styles.checkbox, active && styles.checkboxActive]}>
            {active && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkLabel}>Make this the default address</Text>
        </Pressable>

        <Pressable onPress={validateAndSave} style={styles.saveBtn}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>Save changes</Text>
        </Pressable>

        <Pressable onPress={deleteAndUpdate} style={styles.deleteRow}>
          <Ionicons name="trash-outline" size={20} color="#B22334" style={{ marginRight: 8 }} />
          <Text style={styles.deleteText}>Delete this address</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },
  loadingText: { marginTop: 16, fontFamily: "Poppins-Medium", fontSize: 15, color: "#6B7280" },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10, backgroundColor: "#f8f6f2" },
  navSide: { width: 44, alignItems: "center", justifyContent: "center" },
  navTitleCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 17, color: "#111827", letterSpacing: 0.2 },
  backOuter: { width: 35, height: 35, borderRadius: 999, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)", shadowColor: "#1f2937", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 22, elevation: 14 },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: 12, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  backIconWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  mapCard: { width: "100%", borderRadius: 16, overflow: "hidden", marginBottom: 8, backgroundColor: "#EDEAE5" },
  customPin: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#BC6C25", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  pinTail: { width: 3, height: 8, backgroundColor: "#BC6C25", alignSelf: "center", borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  myLocBtn: { position: "absolute", bottom: 10, right: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 },
  expandBtn: { position: "absolute", bottom: 10, left: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },

  fieldLabel: { fontFamily: "Poppins-Medium", fontSize: 13, color: "#6B7280", marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === "ios" ? 14 : 10, fontFamily: "Poppins-Regular", fontSize: 15, color: "#111827" },
  addressInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  locateSmall: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(188,108,37,0.08)", alignItems: "center", justifyContent: "center" },

  suggestionsWrap: { backgroundColor: "#F9FAFB", borderRadius: 12, marginTop: 6, overflow: "hidden", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  suggestionRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.04)" },
  suggestionText: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#111827", flex: 1 },
  errorText: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#B22334", marginTop: 6 },

  checkRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 20 },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  checkboxActive: { backgroundColor: "#BC6C25", borderColor: "#BC6C25" },
  checkLabel: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#374151" },

  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(188,108,37,0.94)", borderRadius: 999, paddingVertical: 15, marginTop: 24, shadowColor: "#BC6C25", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  saveBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#fff" },

  deleteRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 15, marginTop: 16, borderRadius: 999, borderWidth: 1.5, borderColor: "rgba(178,35,52,0.25)" },
  deleteText: { fontFamily: "Poppins-Medium", fontSize: 15, color: "#B22334" },
});
