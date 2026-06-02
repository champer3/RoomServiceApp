import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import Text from "../components/Text";
import { SERVER_URL } from "../config";
import { useToast } from "../context/ToastContext";
const GREEN = "#2d5c3c";
function AddPin() {
  const OTP_LENGTH = 5;

  const GREEN_LIGHT = "#4a8f5c";

  const route = useRoute();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  const [form, setForm] = useState(data);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const phoneNumber = route.params?.phoneNumber || "";
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

  const [keyboardActive, setKeyboardActive] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardActive(false);
      }
    );

    // Clean up event listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const profile = useSelector((state) => state.profileData.profile);
  const phoneNumberString = phoneNumber.replace(/[^0-9]/g, "");
  const newphoneNumber = "+1" + phoneNumberString;
  function resendCode() {
    if (isActive) return;
    setSeconds(60);
    setIsActive(true);
    resendVerifyNumber();
  }
  
  function handleUpdate() {
    dispatch(updateProfile({ id: { ...form, phoneNumber } }));
  }
  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            clearInterval(intervalId);
            setIsActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive]);
  const navigation = useNavigation();

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

  const otp = otpDigits.join("");
  const canContinue = otp.length === OTP_LENGTH;

  async function pressHandler() {
    Keyboard.dismiss();
    if (!canContinue) return;
    setIsLoading(true);
    let verifyResponse = "";
    try {
      verifyResponse = await verifyNumber(otp);
    } catch (error) {
      console.error("Error:", error);
    }
    if (verifyResponse === "approved") {
      handleUpdate();
      setTimeout(() => {
        navigation.replace("CompleteProfile");
      }, 300);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      showToast({
        type: "error",
        title: "Verification failed",
        message: "Please check your input and try again.",
      });
    }
  }
  const verifyNumber = async (code) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/verifyPhone/${phoneNumber}/${code}`
      );
      console.log(response.data.verification);
      return response.data.verification;
    } catch (err) {
      console.log(err.error);
    }
  }

  const resendVerifyNumber = async () => {
    try {
      console.log(phoneNumber);
      const response = await axios.get(
        `${SERVER_URL}/getCode/${phoneNumber}`
      );
      console.log(response.data);
      showToast({ type: "success", title: "Code sent again." });
    } catch (err) {
      console.log(err.error);
      showToast({ type: "error", title: "Could not resend.", message: "Please try again later." });
    }
  };

  const timerText = `${String(Math.floor(seconds / 60)).padStart(
    2,
    "0"
  )}:${String(seconds % 60).padStart(2, "0")}`;

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }
  function useAnotherNumber() {
    navigation.goBack();
  }
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
      >
        <StatusBar style="dark" />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.titleDark}>Verify your </Text>
            <Text style={styles.titleGreen}>number</Text>
          </View>

          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit code sent to ....{lastThree}
          </Text>

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

          {isActive ? (
            <Text style={styles.resendTimer}>
              Resend code in {timerText}
            </Text>
          ) : (
            <Pressable onPress={resendCode} style={styles.resendWrap}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}

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

export default AddPin;

const { width } = Dimensions.get("window");
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
    paddingTop: 120,
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
