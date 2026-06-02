import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Text from "../components/Text";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../config";
import { useToast } from "../context/ToastContext";

const OTP_LENGTH = 5; // keep in sync with verify API
const GREEN = "#2d5c3c";
const GREEN_LIGHT = "#4a8f5c";

function PinLogin() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  let authToken;
  const route = useRoute();
  const navigation = useNavigation();
  const phoneNumber = route.params?.phoneNumber || "";

  // Last 3 digits for subtitle: "....383"
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const lastThree =
    digitsOnly.length >= 3
      ? digitsOnly.slice(-3)
      : digitsOnly.padStart(3, "•");

  const [otpDigits, setOtpDigits] = useState(
    () => Array(OTP_LENGTH).fill("")
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otp = otpDigits.join("");
  const canContinue = otp.length === OTP_LENGTH;

  useEffect(() => {
    let intervalId;
    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive, seconds]);

  // Start resend cooldown on mount (optional — mockup shows timer after send)
  useEffect(() => {
    setSeconds(60);
    setIsActive(true);
  }, []);

  function handleScreenPress() {
    Keyboard.dismiss();
  }

  function setDigitAt(index, value) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = v;
    setOtpDigits(next);
    if (v && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  }

  function onKeyPress(index, key) {
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
      const next = [...otpDigits];
      next[index - 1] = "";
      setOtpDigits(next);
    }
  }

  function resendCode() {
    if (isActive) return;
    setSeconds(60);
    setIsActive(true);
    resendVerifyNumber();
  }

  async function resendVerifyNumber() {
    try {
      await axios.get(`${SERVER_URL}/getCode/${phoneNumber}`);
    } catch (err) {
      console.log(err);
    }
  }

  const loginData = async () => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/users/loginWithNumber`,
        { phoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );
      authToken = response.data.token;
      return response.data.data.user;
    } catch (err) {
      console.log(err?.response?.data?.message || err?.message || err);
    }
  };

  const verifyNumber = async (code) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/verifyPhone/${phoneNumber}/${code}`
      );
      return response.data.status;
    } catch (err) {
      console.log(err.error);
    }
  };

  const saveTokenToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  async function pressHandler() {
    Keyboard.dismiss();
    if (!canContinue) return;
    const verifyResponse = await verifyNumber(otp);
    if (verifyResponse === "success") {
      const loginInfo = await loginData();
      if (!loginInfo) {
        showToast({ type: "error", title: "Could not complete login", message: "Please try again." });
        return;
      }
      let storedToken = { address: [], orders: [] };
      try {
        await saveTokenToAsyncStorage();
        await AsyncStorage.setItem(
          "profile",
          JSON.stringify({
            firstName: loginInfo.firstName,
            lastName: loginInfo.lastName,
            phoneNumber: loginInfo.phoneNumber,
            email: loginInfo.email,
            password: loginInfo.password,
            address: storedToken.address,
          })
        );
      } catch (error) {
        console.error("Error saving token:", error);
      }
      dispatch(
        updateProfile({
          id: {
            firstName: loginInfo.firstName,
            lastName: loginInfo.lastName,
            phoneNumber: loginInfo.phoneNumber,
            email: loginInfo.email,
            password: loginInfo.password,
            address: storedToken.address,
          },
        })
      );
      navigation.replace("Loader");
    } else {
      showToast({ type: "error", title: "Invalid OTP", message: "Verification failed. Please check your code." });
    }
  }

  function useAnotherNumber() {
    navigation.goBack();
  }

  const timerText = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
      >
        <StatusBar style="dark" />
        <View style={styles.content}>
          {/* Title: "Verify your" + green "identity" */}
          <View style={styles.titleRow}>
            <Text style={styles.titleDark}>Verify your </Text>
            <Text style={styles.titleGreen}>identity</Text>
          </View>

          {/* Subtitle with last 3 digits */}
          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit code sent to ....{lastThree}
          </Text>

          {/* OTP boxes */}
          <View style={styles.otpRow}>
            {otpDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(r) => (inputRefs.current[index] = r)}
                style={[
                  styles.otpBox,
                  activeIndex === index && styles.otpBoxActive,
                ]}
                value={digit}
                onChangeText={(t) => setDigitAt(index, t)}
                onKeyPress={({ nativeEvent }) =>
                  onKeyPress(index, nativeEvent.key)
                }
                onFocus={() => setActiveIndex(index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
                placeholderTextColor="#ccc"
              />
            ))}
          </View>

          {/* Resend */}
          {isActive ? (
            <Text style={styles.resendTimer}>
              Resend code in {timerText}
            </Text>
          ) : (
            <Pressable onPress={resendCode} style={styles.resendWrap}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}

          {/* Continue — gradient + shadow */}
          <View style={styles.ctaShadowWrap}>
            <Pressable
              onPress={canContinue ? pressHandler : undefined}
              disabled={!canContinue}
              style={[styles.ctaPressable, !canContinue && styles.ctaDisabled]}
            >
              <LinearGradient
                colors={
                  canContinue
                    ? [GREEN_LIGHT, "#5a9f6a", "#6faf7a"]
                    : ["#9e9e9e", "#b0b0b0"]
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Continue</Text>
                <Image
                  source={require("../assets/Vector.png")}
                  style={styles.ctaArrow}
                />
              </LinearGradient>
            </Pressable>
          </View>

          <Pressable onPress={useAnotherNumber} style={styles.altWrap}>
            <Text style={styles.altLink}>Use another number</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default PinLogin;

const { width } = Dimensions.get("window");
// Tight spacing between PIN boxes
const BOX_GAP = 10;
const BOX_SIZE = 48;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8faf8",
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  titleDark: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
  },
  titleGreen: {
    fontSize: 26,
    fontWeight: "700",
    color: GREEN,
    fontFamily: "Poppins-Regular",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    fontFamily: "Poppins-Regular",
    marginBottom: 24,
    // lineHeight: 22,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: BOX_GAP,
    marginBottom: 24,
    width: "100%",
  },
  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE + 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e4e0",
    backgroundColor: "#fff",
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
  },
  otpBoxActive: {
    borderColor: GREEN,
    borderWidth: 2,
  },
  resendWrap: {
    alignSelf: "flex-start",
    marginBottom: 28,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: "600",
    color: GREEN,
    fontFamily: "Poppins-Regular",
  },
  resendTimer: {
    fontSize: 14,
    color: "#9ca3af",
    fontFamily: "Poppins-Regular",
    marginBottom: 28,
    textAlign: "center",
  },
  ctaShadowWrap: {
    width: "100%",
    borderRadius: 999,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#0d2818",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  ctaPressable: {
    borderRadius: 999,
    overflow: "hidden",
  },
  ctaDisabled: {
    opacity: 0.85,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Poppins-Regular",
  },
  ctaArrow: {
    width: 22,
    height: 16,
    marginLeft: 8,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  altWrap: {
    alignItems: "center",
  },
  altLink: {
    fontSize: 15,
    color: "#BC6C25",
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
  },
});
