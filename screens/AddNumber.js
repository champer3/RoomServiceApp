import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Text from "../components/Text";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import { SERVER_URL } from "../config";
import { useToast } from "../context/ToastContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function AddNumber() {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);

  function handleScreenPress() {
    Keyboard.dismiss();
  }

  const [number, setNumber] = useState("");
  const phoneNumberString = number.replace(/[^0-9]/g, "");
  const phoneNumber = "+1" + phoneNumberString;
  const canContinue = number.length === 14;

  const formatPhoneNumber = (input) => {
    const cleanedInput = input.replace(/\D/g, "");
    let formattedNumber = "";
    for (let i = 0; i < cleanedInput.length; i++) {
      if (i === 0) formattedNumber += "(";
      else if (i === 3) formattedNumber += ") ";
      else if (i === 6) formattedNumber += "-";
      formattedNumber += cleanedInput[i];
    }
    setNumber(formattedNumber);
  };

  const verifyNumber = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/getCode/${phoneNumber}`);
      return response.data;
    } catch (err) {
      console.log(err?.error || err);
    }
  };

  async function pressHandler() {
    Keyboard.dismiss();
    if (!canContinue) {
      return;
    }
    try {
      const checkNumber = await axios.get(
        `${SERVER_URL}/api/v1/users/getNumber/${phoneNumber}`
      );
      if (checkNumber.data.data) {
        showToast({
          type: "error",
          title: "Phone number already exists",
          message: "Go ahead and login with your phone number.",
        });
        return;
      }

      const updatedProfile = { ...data, number };
      dispatch(updateProfile({ id: updatedProfile }));
      await verifyNumber();
      navigation.navigate("AddPin", { phoneNumber });
    } catch (err) {
      console.log(err);
    }
  }

  function emailHandler() {
    navigation.navigate("EmailSignUp");
  }

  function signInHandler() {
    navigation.navigate("NumberLogin");
  }

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
      >
        <StatusBar style="dark" />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form area — off-white / white */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeTitle}>Secure your account</Text>
            <Text style={styles.welcomeSubtitle}>
              Enter your phone number
            </Text>

            {/* Phone row: light gray field, flag + +1 + input */}
            <View style={styles.phoneField}>
              <View style={styles.phonePrefix}>
                <Image
                  source={require("../assets/dsBuffer.bmp1.png")}
                  style={styles.flag}
                />
                <Text style={styles.prefixText}>+1</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone Number"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={14}
                value={number}
                onChangeText={formatPhoneNumber}
                autoComplete="tel"
              />
            </View>

            {/* Continue — gradient + shadow */}
            <View style={styles.ctaShadowWrap}>
              <Pressable
                onPress={canContinue ? pressHandler : undefined}
                style={[styles.ctaPressable, !canContinue && styles.ctaDisabled]}
                disabled={!canContinue}
              >
                <LinearGradient
                  colors={
                    canContinue
                      ? ["#4a8f5c", "#5a9f6a", "#6faf7a"]
                      : ["#9e9e9e", "#b0b0b0", "#c0c0c0"]
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

            <Text style={styles.verifyHint}>
              We'll send a one-time verification code to confirm your phone
              number.
            </Text>

            {/* or */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Google — white pill, gray border */}
            <Pressable
              style={styles.googleButton}
              onPress={() => navigation.navigate("EmailSignUp", { promptGoogle: true })}
            >
              <Image
                source={require("../assets/google.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleLabel}>Continue with Google</Text>
            </Pressable>

            <Pressable onPress={emailHandler} style={styles.emailLinkWrap}>
              <Text style={styles.emailLink}>Sign up with email</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerPrefix}>
                Already have an account?
              </Text>
              <Pressable onPress={signInHandler}>
                <Text style={styles.footerSignUp}> Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default AddNumber;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8faf8",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingTop: 100,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "#f8faf8",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    fontFamily: "Poppins-Regular",
    marginBottom: 24,
  },
  phoneField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f0",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e4e0",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  phonePrefix: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    resizeMode: "cover",
  },
  prefixText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
    paddingVertical: 0,
  },
  ctaShadowWrap: {
    width: "100%",
    borderRadius: 999,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#0d2818",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },
  ctaPressable: {
    borderRadius: 999,
    overflow: "hidden",
  },
  ctaDisabled: {
    opacity: 0.9,
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
  verifyHint: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 19,
    fontFamily: "Poppins-Regular",
    marginVertical: 8,
    marginBottom: 28,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5d1",
    maxWidth: "38%",
  },
  orText: {
    marginHorizontal: 14,
    fontSize: 14,
    color: "#9ca3af",
    fontFamily: "Poppins-Regular",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 34,
    borderWidth: 1,
    borderColor: "#e0e4e0",
    paddingVertical: 16,
    marginBottom: 20,
  },
  googleIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 10,
  },
  googleLabel: {
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },
  emailLinkWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  emailLink: {
    fontSize: 16,
    color: "#BC6C25",
    fontFamily: "Poppins-SemiBold",
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 21,
  },
  footerPrefix: {
    fontSize: 13,
    color: "#4b5563",
    fontFamily: "Poppins-Regular",
  },
  footerSignUp: {
    fontSize: 13,
    fontWeight: "700",
    color: "#BC6C25",
    fontFamily: "Poppins-SemiBold",
  },
});
