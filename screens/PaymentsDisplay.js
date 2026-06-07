import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import Text from "../components/Text";
import { SERVER_URL } from "../config";
import { useTheme } from "../theme/ThemeContext";

function getBrandLabel(brand) {
  if (!brand) return "Card";
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

function PaymentsDisplay() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [cards, setCards] = useState([]);
  const [defaultPM, setDefaultPM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", exp_month: "", exp_year: "", postal_code: "" });
  const [saving, setSaving] = useState(false);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (e) {
      return null;
    }
  };

  const fetchCards = useCallback(async () => {
    setError(null);
    const token = await getToken();
    if (!token) {
      setLoading(false);
      setError("Please sign in to view payment methods.");
      return;
    }
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/v1/payments/payment-methods`,
        null,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
      );
      if (res.data?.paymentMethods) {
        setCards(res.data.paymentMethods);
      } else {
        setCards([]);
      }
      if (res.data?.defaultPaymentMethod) {
        setDefaultPM(res.data.defaultPaymentMethod);
      }
    } catch (e) {
      setError("Could not load payment methods.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleAddCard = async () => {
    setAdding(true);
    const token = await getToken();
    if (!token) {
      setAdding(false);
      Alert.alert("Error", "Please sign in first.");
      return;
    }
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/v1/payments/payment-sheet`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
      );
      const data = res.data;
      if (!data?.setupIntent || !data?.ephemeralKey || !data?.customer) {
        setAdding(false);
        Alert.alert("Error", "Invalid response from server.");
        return;
      }
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "RoomService",
        setupIntentClientSecret: data.setupIntent,
        customerEphemeralKeySecret: data.ephemeralKey,
        customerId: data.customer,
      });
      if (initError) {
        setAdding(false);
        Alert.alert("Error", initError.message || "Could not initialize.");
        return;
      }
      const { error: presentError } = await presentPaymentSheet();
      setAdding(false);
      if (presentError) {
        if (presentError.code === "Canceled") return;
        Alert.alert("Error", presentError.message || "Payment not completed.");
        return;
      }
      setLoading(true);
      fetchCards();
    } catch (e) {
      setAdding(false);
      Alert.alert("Error", e?.response?.data?.message || e?.message || "Something went wrong.");
    }
  };

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  const handleDeleteCard = (pm) => {
    Alert.alert(
      "Remove Card",
      `Remove ${getBrandLabel(pm.card?.brand)} ending in ${pm.card?.last4}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const token = await getToken();
            if (!token) return;
            try {
              await axios.delete(
                `${SERVER_URL}/api/v1/payments/payment-methods/${pm.id}`,
                { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
              );
              setCards((prev) => prev.filter((c) => c.id !== pm.id));
              if (defaultPM === pm.id) setDefaultPM(null);
            } catch (e) {
              Alert.alert("Error", "Could not remove card. Try again.");
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (pm) => {
    const token = await getToken();
    if (!token) return;
    try {
      await axios.post(
        `${SERVER_URL}/api/v1/payments/payment-methods/set-default`,
        { paymentMethodId: pm.id },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
      );
      setDefaultPM(pm.id);
    } catch (e) {
      Alert.alert("Error", "Could not set as default. Try again.");
    }
  };

  const openEditModal = (pm) => {
    setEditingCard(pm);
    setEditForm({
      name: pm.billing_details?.name || "",
      exp_month: pm.card?.exp_month?.toString() || "",
      exp_year: pm.card?.exp_year?.toString() || "",
      postal_code: pm.billing_details?.address?.postal_code || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;
    setSaving(true);
    const token = await getToken();
    if (!token) { setSaving(false); return; }

    const body = {};
    if (editForm.name.trim()) body.name = editForm.name.trim();
    if (editForm.exp_month) body.exp_month = editForm.exp_month;
    if (editForm.exp_year) body.exp_year = editForm.exp_year.length === 2 ? `20${editForm.exp_year}` : editForm.exp_year;
    if (editForm.postal_code.trim()) body.address_postal_code = editForm.postal_code.trim();

    try {
      const res = await axios.patch(
        `${SERVER_URL}/api/v1/payments/payment-methods/${editingCard.id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
      );
      if (res.data?.paymentMethod) {
        setCards((prev) => prev.map((c) => c.id === editingCard.id ? res.data.paymentMethod : c));
      }
      setEditingCard(null);
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Could not update card.");
    }
    setSaving(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8}>
            <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={isDark ? ["rgba(30,30,30,0.78)", "rgba(30,30,30,0.52)", "rgba(30,30,30,0.44)"] : ["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={isDark ? ["rgba(255,255,255,0.08)", "transparent"] : ["rgba(255,255,255,0.35)", "transparent"]} style={styles.backHighlight} />
            <View style={styles.backIconWrap} pointerEvents="none">
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={[styles.navTitleText, { color: colors.text }]} numberOfLines={1}>Payment Methods</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#283618" />
        </View>
      ) : error ? (
        <View style={styles.centerWrap}>
          <Ionicons name="alert-circle-outline" size={48} color="#B22334" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => { setLoading(true); fetchCards(); }}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 12) + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {cards.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="credit-card-off-outline" size={40} color="#BC6C25" />
              </View>
              <Text style={styles.emptyTitle}>No payment methods</Text>
              <Text style={styles.emptyHint}>Add a card to speed up checkout</Text>
            </View>
          ) : (
            <View style={styles.cardsSection}>
              {cards.map((pm) => {
                const isDefault = defaultPM === pm.id;
                return (
                  <View key={pm.id} style={[styles.cardRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                    <View style={[styles.cardIconCircle, { backgroundColor: colors.primaryLight }]}>
                      <MaterialCommunityIcons name="credit-card-outline" size={22} color={colors.primary} />
                    </View>
                    <View style={styles.cardInfo}>
                      <View style={styles.cardBrandRow}>
                        <Text style={[styles.cardBrand, { color: colors.text }]}>{getBrandLabel(pm.card?.brand)}</Text>
                        {isDefault && (
                          <View style={[styles.defaultBadge, { backgroundColor: colors.primaryLight }]}>
                            <Text style={[styles.defaultBadgeText, { color: colors.primary }]}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.cardLast4, { color: colors.textSecondary }]}>
                        •••• {pm.card?.last4 || "????"}
                        {"  "}
                        <Text style={[styles.cardExpiry, { color: colors.textMuted }]}>
                          {pm.card?.exp_month?.toString().padStart(2, "0")}/{pm.card?.exp_year?.toString().slice(-2)}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      {!isDefault && (
                        <Pressable
                          onPress={() => handleSetDefault(pm)}
                          style={[styles.cardActionBtn, { backgroundColor: colors.primaryLight }]}
                          hitSlop={6}
                        >
                          <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
                        </Pressable>
                      )}
                      <Pressable
                        onPress={() => openEditModal(pm)}
                        style={[styles.cardActionBtn, { backgroundColor: colors.accentLight }]}
                        hitSlop={6}
                      >
                        <Feather name="edit-2" size={14} color={colors.accent} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteCard(pm)}
                        style={[styles.cardActionBtn, { backgroundColor: colors.dangerLight }]}
                        hitSlop={6}
                      >
                        <Feather name="trash-2" size={14} color={colors.danger} />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* Add Card Button */}
      {!loading && !error && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
          <Pressable style={styles.addBtn} onPress={handleAddCard} disabled={adding}>
            {adding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.addBtnText}>Add payment method</Text>
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* Edit Modal */}
      <Modal
        visible={!!editingCard}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingCard(null)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setEditingCard(null)} />
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Card Details</Text>
            {editingCard && (
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                {getBrandLabel(editingCard.card?.brand)} •••• {editingCard.card?.last4}
              </Text>
            )}

            <View style={styles.modalFields}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Cardholder Name</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={editForm.name}
                onChangeText={(v) => setEditForm((p) => ({ ...p, name: v }))}
                placeholder="Name on card"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />

              <View style={styles.modalRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Exp Month</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                    value={editForm.exp_month}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, exp_month: v.replace(/\D/g, "").slice(0, 2) }))}
                    placeholder="MM"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Exp Year</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                    value={editForm.exp_year}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, exp_year: v.replace(/\D/g, "").slice(0, 4) }))}
                    placeholder="YYYY"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>
              </View>

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Billing Zip / Postal Code</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={editForm.postal_code}
                onChangeText={(v) => setEditForm((p) => ({ ...p, postal_code: v }))}
                placeholder="Postal code"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setEditingCard(null)}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

export default PaymentsDisplay;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f2" },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 48, alignItems: "center" },
  navTitleCenter: { flex: 1, alignItems: "center" },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827" },
  backOuter: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: "50%", borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  backIconWrap: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },

  scroll: { flex: 1 },

  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  errorText: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#6B7280", textAlign: "center", marginTop: 12 },
  retryBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: "#283618", borderRadius: 999 },
  retryBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#fff" },

  emptyWrap: { alignItems: "center", paddingTop: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(188,108,37,0.10)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#111827" },
  emptyHint: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#6B7280", marginTop: 4, textAlign: "center" },

  cardsSection: { marginTop: 12 },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(40,54,24,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, marginLeft: 14 },
  cardBrandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardBrand: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#111827" },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  defaultBadgeText: { fontFamily: "Poppins-Medium", fontSize: 11 },
  cardLast4: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#6B7280", marginTop: 2 },
  cardExpiry: { color: "#9CA3AF" },
  cardActions: { flexDirection: "row", gap: 8, marginLeft: 8 },
  cardActionBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },

  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 14, backgroundColor: "#f8f6f2" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(188,108,37,0.94)", borderRadius: 999, paddingVertical: 15, shadowColor: "#BC6C25", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  addBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#fff" },

  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.12)", alignSelf: "center", marginBottom: 16 },
  modalTitle: { fontFamily: "Poppins-SemiBold", fontSize: 18, marginBottom: 4 },
  modalSubtitle: { fontFamily: "Poppins-Regular", fontSize: 14, marginBottom: 20 },
  modalFields: { gap: 12 },
  modalLabel: { fontFamily: "Poppins-Regular", fontSize: 12, marginBottom: 4 },
  modalInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: "Poppins-Regular", fontSize: 15 },
  modalRow: { flexDirection: "row", gap: 12 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  modalCancelBtn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  modalCancelText: { fontFamily: "Poppins-Regular", fontSize: 14 },
  modalSaveBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  modalSaveText: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#fff" },
});
