import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Text from "../components/Text";
import { useTheme } from "../theme/ThemeContext";

const { width, height } = Dimensions.get("window");

function AccountDisplay() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const data = useSelector((state) => state.profileData.profile);
  const { colors, isDark } = useTheme();
  const [logged, setLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("profile");
      if (token) setLogged(true);
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    })();
  }, []);

  const fullName = data
    ? `${data.firstName || ""} ${data.lastName || ""}`.trim().replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingWrap}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.headerTitle}>Account</Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  if (!logged) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.notLoggedWrap}>
          <Image style={styles.emptyImage} source={require("../assets/empty.png")} />
          <Text style={[styles.notLoggedTitle, { color: colors.text }]}>You're not logged in</Text>
          <Text style={[styles.notLoggedHint, { color: colors.textSecondary }]}>Sign in or create an account to manage your profile</Text>
          <Pressable
            style={[styles.getAccountBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.replace("Authentication", { screen: "StartScreen" })}
          >
            <Text style={styles.getAccountBtnText}>Get started</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.inner, { opacity: fadeAnim, paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Account</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Manage your profile & preferences</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info Card */}
          <View style={[styles.userCard, { backgroundColor: colors.userCardBg }]}>
            <View style={styles.userCardLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>
                  {data?.firstName ? data.firstName.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.userCardText }]} numberOfLines={1}>{fullName || "User"}</Text>
                <Text style={[styles.userEmail, { color: colors.userCardTextSecondary }]} numberOfLines={1}>{data?.email || ""}</Text>
                {data?.phone ? (
                  <Text style={[styles.userPhone, { color: colors.userCardTextSecondary }]} numberOfLines={1}>{data.phone}</Text>
                ) : null}
              </View>
            </View>
            <Pressable
              style={styles.userEditBtn}
              onPress={() => navigation.navigate("Profile")}
              hitSlop={10}
            >
              <Feather name="edit-2" size={16} color={colors.accent} />
            </Pressable>
          </View>

          {/* Menu Items */}
          <View style={[styles.menuSection, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <MenuItem
              icon={<Ionicons name="receipt-outline" size={22} color={colors.primary} />}
              title="Orders"
              subtitle="View your order history"
              onPress={() => navigation.navigate("Order History")}
            />
            <MenuItem
              icon={<Ionicons name="heart-outline" size={22} color={colors.primary} />}
              title="My Favorites"
              subtitle="Products you've saved"
              onPress={() => navigation.navigate("Favorites")}
            />
            <MenuItem
              icon={<Ionicons name="location-outline" size={22} color={colors.primary} />}
              title="Addresses"
              subtitle="Manage saved addresses"
              onPress={() => navigation.navigate("Address")}
            />
            <MenuItem
              icon={<MaterialCommunityIcons name="wallet-outline" size={22} color={colors.primary} />}
              title="Payment Methods"
              subtitle="Manage cards & payment options"
              onPress={() => navigation.navigate("Payment")}
            />
            <MenuItem
              icon={<Ionicons name="notifications-outline" size={22} color={colors.primary} />}
              title="Notifications"
              subtitle="Notification preferences"
              onPress={() => navigation.navigate("Notifications")}
            />
            <MenuItem
              icon={<Feather name="settings" size={22} color={colors.primary} />}
              title="Settings"
              subtitle="App preferences"
              onPress={() => navigation.navigate("Settings")}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function MenuItem({ icon, title, subtitle, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.menuItem, { borderBottomColor: colors.borderHairline }]} onPress={onPress}>
      <View style={[styles.menuIconCircle, { backgroundColor: colors.primaryLight }]}>{icon}</View>
      <View style={styles.menuTextWrap}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default AccountDisplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f2",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 18,
  },
  loadingWrap: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  headerBlock: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#6b7280",
    marginTop: 2,
    lineHeight: 22,
  },

  scroll: {
    flex: 1,
  },

  // User card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#283618",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  userCardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#BC6C25",
    borderWidth: 0.18,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarLetter: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#fff",
    lineHeight: 26,
  },
  userEmail: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  userPhone: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    marginTop: 2,
  },
  userEditBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  // Menu
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  menuIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(40,54,24,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextWrap: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    letterSpacing: -0.5,
    color: "#111827",
  },
  menuSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Not logged in
  notLoggedWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: width * 0.5,
    height: height / 4,
    resizeMode: "contain",
    marginBottom: 24,
  },
  notLoggedTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#111827",
    textAlign: "center",
  },
  notLoggedHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  getAccountBtn: {
    marginTop: 28,
    backgroundColor: "#283618",
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  getAccountBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
