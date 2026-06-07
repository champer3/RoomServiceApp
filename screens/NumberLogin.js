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
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { updateProfile } from "../Data/profile";
import React, { useEffect, useState } from "react";
import Text from "../components/Text";
import axios from "axios";
import { SERVER_URL, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "../config";
import {
  nativeGoogleSignIn,
  isNativeGoogleAvailable,
  isGoogleSignInBlocked,
  getGoogleSignInBlockedMessage,
} from "../utils/googleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../context/ToastContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
WebBrowser.maybeCompleteAuthSession();

function NumberLogin() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { showToast } = useToast();
  // expo-auth-session hook (used on iOS; on Android we use native sign-in instead)
  const [iosRequest, iosResponse, iosPromptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_WEB_CLIENT_ID || GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    selectAccount: true,
  });

  const saveTokenToAsyncStorage = async (authToken) => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      await AsyncStorage.setItem("onboarded", "true");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const emailLogin = async (postData) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/users/loginWithEmail`,
        JSON.stringify(postData),
        { headers: { "Content-Type": "application/json" } }
      );
      const authToken = response.data.token;
      await saveTokenToAsyncStorage(authToken);
      return response.data.data.user;
    } catch (err) {
      console.log(err.error);
    }
  };

  const getUsersProfile = async (token) => {
    if (!token) return null;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return await response.json();
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  async function checkEmail(email) {
    const userEmail = await axios.get(
      `${SERVER_URL}/api/v1/users/getEmail/${email}`
    );
    return userEmail.data.data.user.length;
  }

  const completeGoogleLogin = async (googleEmail, googleId) => {
    setIsLoading(true);
    try {
      const postData = { email: googleEmail, googleID: googleId };
      const emailCheckResult = await checkEmail(googleEmail);
      if (emailCheckResult >= 1) {
        const userResponse = await emailLogin(postData);
        if (userResponse?.firstName && userResponse?.email) {
          await AsyncStorage.setItem(
            "profile",
            JSON.stringify({
              firstName: userResponse.firstName,
              lastName: userResponse.lastName,
              phoneNumber: userResponse.phoneNumber,
              email: userResponse.email,
              password: userResponse.password,
              address: userResponse.address || [],
            })
          );
          dispatch(
            updateProfile({
              id: {
                firstName: userResponse.firstName,
                lastName: userResponse.lastName,
                phoneNumber: userResponse.phoneNumber,
                email: userResponse.email,
                password: userResponse.password,
                address: userResponse.address || [],
              },
            })
          );
          navigation.replace("Loader");
        } else {
          showToast({ type: "error", title: "Invalid input", message: "Check the email or password." });
        }
      } else {
        showToast({
          type: "error",
          title: "No account found",
          message: "Please sign up first to use Google sign in.",
        });
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      showToast({ type: "error", title: "Login failed", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  // Android: native Google Sign-In
  const handleAndroidGoogleSignIn = async () => {
    try {
      const result = await nativeGoogleSignIn({ selectAccount: true });
      if (result.cancelled) return;
      await completeGoogleLogin(result.email, result.googleId);
    } catch (err) {
      showToast({ type: "error", title: "Google sign-in failed", message: err?.message || "Something went wrong." });
    }
  };

  // iOS: handle expo-auth-session response
  useEffect(() => {
    if (Platform.OS !== "ios" || iosResponse?.type !== "success") return;
    const token = iosResponse.authentication?.accessToken ?? iosResponse.authentication?.refreshToken;

    (async () => {
      setIsLoading(true);
      try {
        const user = await getUsersProfile(token);
        if (!user?.email) {
          setIsLoading(false);
          showToast({ type: "error", title: "Google sign-in failed", message: "Could not get your email from Google." });
          return;
        }
        await completeGoogleLogin(user.email, user.id);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [iosResponse]);

  const googleReady = isNativeGoogleAvailable() || !!iosRequest;
  const handleGooglePress = () => {
    if (isLoading) return;
    if (isGoogleSignInBlocked()) {
      showToast({
        type: "error",
        title: "Use development build",
        message: getGoogleSignInBlockedMessage(),
      });
      return;
    }
    if (isNativeGoogleAvailable()) {
      handleAndroidGoogleSignIn();
    } else if (iosRequest) {
      iosPromptAsync();
    }
  };

  function handleScreenPress() {
    Keyboard.dismiss();
  }

  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState("");
  const phoneNumberString = number.replace(/[^0-9]/g, "");
  const phoneNumber = "+1" + phoneNumberString;
  const canContinue = number.length === 14;

  async function pressHandler() {
    Keyboard.dismiss();
    let response = "";
    try {
      response = await verifyNumber();
    } catch (error) {}
    if (response) {
      navigation.navigate("PinLogin", { phoneNumber });
    } else {
      showToast({
        type: "error",
        title: "No account found",
        message: "Please sign up.",
      });
    }
  }

  const verifyNumber = async () => {
    try {
      const checkNumber = await axios.get(
        `${SERVER_URL}/api/v1/users/getNumber/${phoneNumber}`
      );
      if (checkNumber.data.data) {
        await axios.get(`${SERVER_URL}/getCode/${phoneNumber}`);
      }
      return checkNumber.data.data;
    } catch (err) {
      console.log(err.error);
    }
  };

  function emailHandler() {
    navigation.navigate("EmailLogin");
  }

  function signUpHandler() {
    navigation.navigate("CreateAccount");
  }

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

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
      >
        <StatusBar style="dark" />
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2d5c3c" />
          </View>
        ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: gradient + logo (asset matches mockup) */}
      

          {/* Form area — off-white / white */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeTitle}>Welcome back </Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>

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
              style={[styles.googleButton, (!googleReady || isLoading) && { opacity: 0.7 }]}
              onPress={handleGooglePress}
              disabled={!googleReady || isLoading}
            >
              <Image
                source={require("../assets/google.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleLabel}>Continue with Google</Text>
            </Pressable>

            <Pressable onPress={emailHandler} style={styles.emailLinkWrap}>
              <Text style={styles.emailLink}>Sign in with email</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerPrefix}>New to RoomService?</Text>
              <Pressable onPress={signUpHandler}>
                <Text style={styles.footerSignUp}> Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default NumberLogin;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8faf8",
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8faf8",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingTop: 100
  },
  headerWrap: {
    width: "100%",
    height: SCREEN_H * 0.28,
    minHeight: 200,
    backgroundColor: "#e8f0ea",
  },
  headerImage: {
    width: "100%",
    height: "100%",
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
    textAlign: "center"
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
    marginTop: 21
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
