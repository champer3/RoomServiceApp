import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Text from "../components/Text";
import { useTheme } from "../theme/ThemeContext";
import { updateProfile } from "../Data/profile";
import { SERVER_URL } from "../config";
import { useToast } from "../context/ToastContext";

const OTP_LENGTH = 5;

function ProfileDisplay() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const { showToast } = useToast();
  const data = useSelector((state) => state.profileData.profile);

  const [phoneMode, setPhoneMode] = useState("view");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);
  const countdownRef = useRef(null);

  const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ") || "—";
  const email = data?.email || "—";
  const phone = data?.phoneNumber || data?.phone || "";

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "").slice(0, 10);
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 0) formatted += "(";
      else if (i === 3) formatted += ") ";
      else if (i === 6) formatted += "-";
      formatted += cleaned[i];
    }
    return formatted;
  };

  const formattedPhoneDisplay = phone
    ? phone.startsWith("+1")
      ? formatPhoneNumber(phone.slice(2))
      : formatPhoneNumber(phone.replace(/\D/g, ""))
    : null;

  const canSendCode = phoneInput.replace(/\D/g, "").length === 10;

  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendVerificationCode = async () => {
    if (!canSendCode) return;
    Keyboard.dismiss();
    setIsLoading(true);
    const digits = phoneInput.replace(/\D/g, "");
    const fullNumber = "+1" + digits;
    try {
      const check = await axios.get(`${SERVER_URL}/api/v1/users/getNumber/${fullNumber}`);
      if (check.data.data) {
        const existingUser = check.data.data;
        if (existingUser.email !== data?.email) {
          showToast({
            type: "error",
            title: "Number already in use",
            message: "This phone number is linked to another account. It may be used as a sign-in method by someone else.",
          });
          setIsLoading(false);
          return;
        }
      }
      await axios.get(`${SERVER_URL}/getCode/${fullNumber}`);
      setPhoneMode("otp");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setActiveOtpIndex(0);
      startCountdown();
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      showToast({ type: "error", title: "Error", message: "Could not send verification code. Try again." });
    }
    setIsLoading(false);
  };

  const verifyAndSave = async () => {
    const code = otpDigits.join("");
    if (code.length < OTP_LENGTH) return;
    setIsLoading(true);
    const digits = phoneInput.replace(/\D/g, "");
    const fullNumber = "+1" + digits;
    try {
      const resp = await axios.get(`${SERVER_URL}/verifyPhone/${fullNumber}/${code}`);
      if (resp.data.verification === "approved") {
        dispatch(updateProfile({ id: { ...data, phoneNumber: fullNumber } }));
        const token = await AsyncStorage.getItem("authToken");
        if (token && data?.email) {
          axios.patch(`${SERVER_URL}/api/v1/users/${data.email}`, { phoneNumber: fullNumber }, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
        }
        showToast({ type: "success", title: "Phone verified", message: "Your phone number has been updated." });
        setPhoneMode("view");
      } else {
        showToast({ type: "error", title: "Invalid code", message: "The code you entered is incorrect." });
      }
    } catch (err) {
      showToast({ type: "error", title: "Verification failed", message: "Please check and try again." });
    }
    setIsLoading(false);
  };

  const setOtpDigitAt = (index, value) => {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = v;
    setOtpDigits(next);
    if (v && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
      setActiveOtpIndex(index + 1);
    }
  };

  const onOtpKeyPress = (index, key) => {
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      setActiveOtpIndex(index - 1);
      const next = [...otpDigits];
      next[index - 1] = "";
      setOtpDigits(next);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    const digits = phoneInput.replace(/\D/g, "");
    const fullNumber = "+1" + digits;
    try {
      await axios.get(`${SERVER_URL}/getCode/${fullNumber}`);
      startCountdown();
      showToast({ type: "success", title: "Code sent", message: "A new verification code has been sent." });
    } catch (err) {
      showToast({ type: "error", title: "Error", message: "Could not resend code." });
    }
  };

  function goBack() {
    if (phoneMode !== "view") {
      setPhoneMode("view");
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Custom header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
            <LinearGradient
              pointerEvents="none"
              colors={isDark
                ? ["rgba(30,30,30,0.78)", "rgba(30,30,30,0.52)", "rgba(30,30,30,0.44)"]
                : ["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              pointerEvents="none"
              colors={isDark ? ["rgba(255,255,255,0.08)", "transparent"] : ["rgba(255,255,255,0.35)", "transparent"]}
              style={styles.backHighlight}
            />
            <View style={styles.backIconWrap} pointerEvents="none">
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar and name */}
        <View style={styles.profileTop}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarLetter}>
              {data?.firstName ? data.firstName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={[styles.displayName, { color: colors.text }]}>{fullName}</Text>
          <Text style={[styles.displayEmail, { color: colors.textSecondary }]}>{email}</Text>
        </View>

        {/* Info fields */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <Text style={[styles.fieldValue, { color: colors.text }]}>{fullName}</Text>
            </View>
            <View style={[styles.lockBadge, { backgroundColor: colors.skeleton }]}>
              <Feather name="lock" size={12} color={colors.textMuted} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.fieldValue, { color: colors.text }]}>{email}</Text>
            </View>
            <View style={[styles.lockBadge, { backgroundColor: colors.skeleton }]}>
              <Feather name="lock" size={12} color={colors.textMuted} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Phone field - dynamic */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Phone Number</Text>
              {phone ? (
                <Text style={[styles.fieldValue, { color: colors.text }]}>{formattedPhoneDisplay}</Text>
              ) : (
                <Text style={[styles.fieldValue, { color: colors.textMuted, fontStyle: "italic" }]}>Not added yet</Text>
              )}
            </View>
            {phoneMode === "view" && (
              <Pressable
                style={[styles.editBadge, { backgroundColor: colors.accentLight }]}
                onPress={() => {
                  setPhoneMode("input");
                  setPhoneInput(phone ? phone.replace("+1", "") : "");
                }}
                hitSlop={8}
              >
                <Feather name={phone ? "edit-2" : "plus"} size={12} color={colors.accent} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Phone number input area */}
        {phoneMode === "input" && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: 16 }]}>
            <Text style={[styles.phonePromptTitle, { color: colors.text }]}>
              {phone ? "Update Phone Number" : "Add Phone Number"}
            </Text>
            <Text style={[styles.phonePromptSub, { color: colors.textSecondary }]}>
              We'll send a verification code via SMS
            </Text>

            <View style={[styles.phoneInputRow, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
              <Image source={require("../assets/dsBuffer.bmp1.png")} style={styles.flag} />
              <Text style={[styles.phonePrefix, { color: colors.text }]}>+1</Text>
              <TextInput
                style={[styles.phoneTextInput, { color: colors.text }]}
                placeholder="(000) 000-0000"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={14}
                value={formatPhoneNumber(phoneInput)}
                onChangeText={(t) => setPhoneInput(t.replace(/\D/g, ""))}
                autoFocus
              />
            </View>

            <View style={styles.phoneActions}>
              <Pressable style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setPhoneMode("view")}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.sendCodeBtn, { backgroundColor: canSendCode ? colors.primary : colors.skeleton }]}
                onPress={sendVerificationCode}
                disabled={!canSendCode || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendCodeBtnText}>Send Code</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* OTP input area */}
        {phoneMode === "otp" && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: 16 }]}>
            <Text style={[styles.phonePromptTitle, { color: colors.text }]}>Enter Verification Code</Text>
            <Text style={[styles.phonePromptSub, { color: colors.textSecondary }]}>
              Sent to +1 {formatPhoneNumber(phoneInput)}
            </Text>

            <View style={styles.otpRow}>
              {otpDigits.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (otpRefs.current[i] = r)}
                  style={[
                    styles.otpBox,
                    {
                      borderColor: activeOtpIndex === i ? colors.primary : colors.border,
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                    },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(v) => setOtpDigitAt(i, v)}
                  onKeyPress={({ nativeEvent }) => onOtpKeyPress(i, nativeEvent.key)}
                  onFocus={() => setActiveOtpIndex(i)}
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={styles.otpActions}>
              <Pressable onPress={resendCode} disabled={countdown > 0}>
                <Text style={[styles.resendText, { color: countdown > 0 ? colors.textMuted : colors.accent }]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.phoneActions}>
              <Pressable style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setPhoneMode("input")}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Back</Text>
              </Pressable>
              <Pressable
                style={[styles.sendCodeBtn, { backgroundColor: otpDigits.join("").length === OTP_LENGTH ? colors.primary : colors.skeleton }]}
                onPress={verifyAndSave}
                disabled={otpDigits.join("").length < OTP_LENGTH || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendCodeBtnText}>Verify</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Info hint */}
        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.hintText, { color: colors.textMuted }]}>
            Name and email cannot be changed. Contact support if you need to update them.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ProfileDisplay;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBottom: 12,
  },
  navSide: { width: 44, alignItems: "center", justifyContent: "center" },
  navTitleCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  backOuter: {
    width: 35,
    height: 35,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 14,
  },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: 12, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  backIconWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  scroll: { flex: 1 },
  profileTop: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLetter: {
    fontFamily: "Poppins-Regular",
    fontSize: 22,
    color: "#fff",
  },
  displayName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    marginBottom: 2,
  },
  displayEmail: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  fieldIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  fieldContent: { flex: 1 },
  fieldLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    marginBottom: 2,
  },
  fieldValue: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  lockBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, marginLeft: 50 },
  phonePromptTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  phonePromptSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    marginBottom: 16,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  flag: {
    width: 24,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
    resizeMode: "cover",
  },
  phonePrefix: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    marginRight: 8,
  },
  phoneTextInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    paddingVertical: 0,
  },
  phoneActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  sendCodeBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  sendCodeBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  otpBox: {
    width: 48,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
  otpActions: {
    alignItems: "center",
    marginBottom: 16,
  },
  resendText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginTop: 20,
    gap: 8,
  },
  hintText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
});
