import React, { useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  ScrollView,
  Switch,
  Linking,
  Platform,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Text from "../components/Text";
import { unregisterPushToken } from "../Data/notify";
import { disconnectSocket } from "../socketService";
import { SERVER_URL } from "../config";
import { useTheme } from "../theme/ThemeContext";
import { resetProfile } from "../Data/profile";
import { resetCartLocal } from "../Data/cart";
import { resetOrders } from "../Data/order";
import { resetFavorites } from "../Data/favorites";

const PREFS_KEY = "app_preferences";

function Settings() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  const { isDark, toggleTheme, colors } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PREFS_KEY);
        if (stored) {
          const prefs = JSON.parse(stored);
          if (prefs.pushEnabled !== undefined) setPushEnabled(prefs.pushEnabled);
          if (prefs.orderUpdates !== undefined) setOrderUpdates(prefs.orderUpdates);
          if (prefs.promoNotifs !== undefined) setPromoNotifs(prefs.promoNotifs);
        }
      } catch (e) {}
    })();
  }, []);

  const savePrefs = async (updates) => {
    try {
      const stored = await AsyncStorage.getItem(PREFS_KEY);
      const current = stored ? JSON.parse(stored) : {};
      const merged = { ...current, ...updates };
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(merged));
    } catch (e) {}
  };

  const togglePush = (val) => {
    setPushEnabled(val);
    savePrefs({ pushEnabled: val });
    if (!val) {
      setOrderUpdates(false);
      setPromoNotifs(false);
      savePrefs({ pushEnabled: false, orderUpdates: false, promoNotifs: false });
    }
  };

  const toggleOrderUpdates = (val) => {
    setOrderUpdates(val);
    savePrefs({ orderUpdates: val });
  };

  const togglePromoNotifs = (val) => {
    setPromoNotifs(val);
    savePrefs({ promoNotifs: val });
  };

  const retrievePrivateToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) return token;
    } catch (e) {}
    return null;
  };

  const logoutHandler = useCallback(async () => {
    try { await dispatch(unregisterPushToken()); } catch (e) {}
    disconnectSocket();
    dispatch(resetProfile());
    dispatch(resetCartLocal());
    dispatch(resetOrders());
    dispatch(resetFavorites());
    await AsyncStorage.multiRemove(["authToken", "profile"]);
    navigation.reset({ index: 0, routes: [{ name: "Authentication", params: { screen: "StartScreen" } }] });
  }, [dispatch, navigation]);

  const deleteHandler = useCallback(async () => {
    try {
      const token = await retrievePrivateToken();
      if (!token) return;
      await axios.delete(`${SERVER_URL}/api/v1/users/${data?.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      disconnectSocket();
      dispatch(resetProfile());
      dispatch(resetCartLocal());
      dispatch(resetOrders());
      dispatch(resetFavorites());
      await AsyncStorage.multiRemove(["authToken", "profile"]);
      navigation.reset({ index: 0, routes: [{ name: "Authentication", params: { screen: "StartScreen" } }] });
    } catch (error) {
      Alert.alert("Error", "Could not delete account. Please try again.");
    }
  }, [data?.email, dispatch, navigation]);

  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteHandler, style: "destructive" },
      ]
    );
  };

  const clearCache = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => !["authToken", "profile", PREFS_KEY].includes(k));
      await AsyncStorage.multiRemove(cacheKeys);
      Alert.alert("Done", "App cache cleared successfully.");
    } catch (e) {
      Alert.alert("Error", "Could not clear cache.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 12) + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.row, styles.rowLast]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="moon-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Switch to dark theme</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                thumbColor={isDark ? colors.switchThumbOn : colors.switchThumbOff}
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Notifications</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Receive alerts on your device</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={togglePush}
                trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                thumbColor={pushEnabled ? colors.switchThumbOn : colors.switchThumbOff}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="receipt-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Order Updates</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Status changes & delivery alerts</Text>
              </View>
              <Switch
                value={orderUpdates && pushEnabled}
                onValueChange={toggleOrderUpdates}
                disabled={!pushEnabled}
                trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                thumbColor={orderUpdates && pushEnabled ? colors.switchThumbOn : colors.switchThumbOff}
              />
            </View>

            <View style={[styles.row, styles.rowLast]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons name="tag-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Promotions & Deals</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Special offers & new arrivals</Text>
              </View>
              <Switch
                value={promoNotifs && pushEnabled}
                onValueChange={togglePromoNotifs}
                disabled={!pushEnabled}
                trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                thumbColor={promoNotifs && pushEnabled ? colors.switchThumbOn : colors.switchThumbOff}
              />
            </View>
          </View>
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>General</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Pressable style={styles.row} onPress={clearCache}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="refresh-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Clear Cache</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Free up storage & fix issues</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>

            <Pressable
              style={[styles.row, styles.rowLast]}
              onPress={() => {
                Linking.openSettings();
              }}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Feather name="smartphone" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>System Permissions</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Location, camera & more</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Support</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Pressable
              style={styles.row}
              onPress={() => Linking.openURL("mailto:support@roomservice.app")}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Contact Support</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Get help via email</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>

            <Pressable style={[styles.row, styles.rowLast]} onPress={() => Linking.openURL("https://roomservice.app/terms")}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Terms & Privacy</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Legal information</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Account</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Pressable style={styles.row} onPress={logoutHandler}>
              <View style={[styles.iconCircle, { backgroundColor: colors.dangerLight }]}>
                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.danger }]}>Log out</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Sign out of your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>

            <Pressable style={[styles.row, styles.rowLast]} onPress={showDeleteAlert}>
              <View style={[styles.iconCircle, { backgroundColor: colors.dangerLight }]}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={[styles.rowTitle, { color: colors.danger }]}>Delete account</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Permanently remove your data</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* Version */}
        <Text style={[styles.versionText, { color: colors.textMuted }]}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },
  scroll: { flex: 1 },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(40,54,24,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  rowTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#111827",
  },
  rowSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  versionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
});
