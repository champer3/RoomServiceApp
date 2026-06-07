import { StyleSheet, View, Pressable, Dimensions, ScrollView, Platform, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/Text";

const { width, height } = Dimensions.get("window");

function AddressDisplay() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const address = useSelector((state) => state.profileData.profile)?.address || [];

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
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
          <Text style={styles.navTitleText} numberOfLines={1}>My Addresses</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {address.length === 0 && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="location-outline" size={40} color="#BC6C25" />
            </View>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptyHint}>Add an address to speed up your deliveries</Text>
          </View>
        )}

        {address.map(({ name, address: addr, nameNo, id, number }, idx) => (
          <Pressable
            key={idx}
            style={styles.addressCard}
            onPress={() => navigation.navigate("Map", { name, address: addr, nameNo, id, number })}
          >
            <View style={styles.addressIconCircle}>
              <Ionicons name="location-outline" size={20} color="#BC6C25" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName} numberOfLines={1}>{name || "Address"}</Text>
              <Text style={styles.addressDetail} numberOfLines={2}>{addr}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
        ))}
      </ScrollView>

      {/* Floating add button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <Pressable onPress={() => navigation.navigate("Add Address")} style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addBtnText}>Add new address</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default AddressDisplay;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 48, alignItems: "center" },
  navTitleCenter: { flex: 1, alignItems: "center" },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827" },
  backOuter: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: "50%", borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  backIconWrap: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },

  emptyWrap: { alignItems: "center", paddingTop: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(188,108,37,0.10)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827" },
  emptyHint: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#6B7280", marginTop: 4, textAlign: "center" },

  addressCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  addressIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(188,108,37,0.08)", alignItems: "center", justifyContent: "center" },
  addressInfo: { flex: 1, marginHorizontal: 14 },
  addressName: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#111827" },
  addressDetail: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", marginTop: 2 },

  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 14, backgroundColor: "#f8f6f2" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(188,108,37,0.94)", borderRadius: 999, paddingVertical: 15, shadowColor: "#BC6C25", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  addBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#fff" },
});
