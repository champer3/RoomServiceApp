import { StyleSheet, View, Pressable, Dimensions, ScrollView, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { useNavigation } from "@react-navigation/native";
import { syncAddresses } from "../api/syncService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/Text";

const { width } = Dimensions.get("window");

function AddressConfirm() {
  const data = useSelector((state) => state.profileData.profile);
  const address = [...data.address];
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  function makeDefault(id) {
    setIsLoading(true);
    const newData = { ...data, address: [{ ...data.address[id], id: 0 }] };
    let j = 1;
    for (let i = 0; i < data.address.length; i++) {
      if (data.address[i].id !== id) {
        newData.address.push({ ...data.address[i], id: j });
        j += 1;
      }
    }
    dispatch(updateProfile({ id: newData }));
    syncAddresses(newData.address).catch(() => {});
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 500);
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#BC6C25" />
        <Text style={{ marginTop: 16, fontFamily: "Poppins-Medium", fontSize: 15, color: "#6B7280" }}>Saving…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8}>
            <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint="light" style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.35)", "transparent"]} style={styles.backHighlight} />
            <View style={styles.backIconWrap} pointerEvents="none">
              <Ionicons name="chevron-back" size={18} color="#111827" />
            </View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={styles.navTitleText} numberOfLines={1}>Select Address</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {address.map((item, idx) => {
          const { name, address: addr } = item;
          const isActive = selected === idx;
          return (
            <Pressable key={idx} onPress={() => setSelected(idx)} style={[styles.addressCard, isActive && styles.addressCardActive]}>
              <View style={[styles.addressIconCircle, isActive && styles.addressIconCircleActive]}>
                <Ionicons name="location" size={20} color={isActive ? "#fff" : "#BC6C25"} />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressName} numberOfLines={1}>{name || "Address"}</Text>
                <Text style={styles.addressDetail} numberOfLines={2}>{addr}</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate("Map", { ...item, id: idx })}
                style={styles.editBtn}
                hitSlop={6}
              >
                <Ionicons name="create-outline" size={16} color="#6B7280" />
              </Pressable>
              <View style={[styles.radio, isActive && styles.radioActive]}>
                {isActive && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}

        <Pressable onPress={() => navigation.navigate("Add Address")} style={styles.addNewRow}>
          <View style={styles.addNewIcon}>
            <Ionicons name="add" size={20} color="#BC6C25" />
          </View>
          <Text style={styles.addNewText}>Add new address</Text>
        </Pressable>
        <View style={{ height: 10 }} />
      </ScrollView>

      {/* Floating select button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <Pressable onPress={() => makeDefault(selected)} style={styles.selectBtn}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.selectBtnText}>Use this address</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default AddressConfirm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 48, alignItems: "center" },
  navTitleCenter: { flex: 1, alignItems: "center" },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827" },
  backOuter: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: "50%", borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  backIconWrap: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },

  addressCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.06)" },
  addressCardActive: { borderColor: "#BC6C25", backgroundColor: "rgba(188,108,37,0.04)" },
  addressIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(188,108,37,0.08)", alignItems: "center", justifyContent: "center" },
  addressIconCircleActive: { backgroundColor: "#BC6C25" },
  addressInfo: { flex: 1, marginHorizontal: 14 },
  addressName: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#111827" },
  addressDetail: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", marginTop: 2 },

  editBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.04)", alignItems: "center", justifyContent: "center", marginRight: 10 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: "#BC6C25" },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#BC6C25" },

  addNewRow: { alignItems: "center", paddingVertical: 18, gap: 10, marginTop: 6 },
  addNewIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: "rgba(188,108,37,0.3)", borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  addNewText: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#BC6C25" },

  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 14, backgroundColor: "#f8f6f2" },
  selectBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(188,108,37,0.94)", borderRadius: 999, paddingVertical: 15, shadowColor: "#BC6C25", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  selectBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#fff" },
});
