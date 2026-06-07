import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Text from "../components/Text";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import { SERVER_URL, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "../context/ToastContext";

WebBrowser.maybeCompleteAuthSession();

const GREEN = "#2d5c3c";
const GREEN_GRADIENT = ["#4a8f5c", "#5a9f6a", "#6faf7a"];

function EmailLogin() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const saveTokenToAsyncStorage = async (authToken) => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      await AsyncStorage.setItem("onboarded", "true");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const emailLoginWithGoogle = async (postData) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/v1/users/loginWithEmail`,
        JSON.stringify(postData),
        { headers: { "Content-Type": "application/json" } }
      );
      const authToken = res.data.token;
      await saveTokenToAsyncStorage(authToken);
      return res.data.data.user;
    } catch (err) {
      console.log(err?.message || err);
    }
  };

  const getUsersProfile = async (token) => {
    if (!token) return null;
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return await res.json();
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  async function checkEmail(emailAddress) {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/v1/users/getEmail/${emailAddress}`
      );
      return res.data?.data?.user?.length ?? 0;
    } catch (err) {
      return 0;
    }
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;

      (async () => {
        setIsLoading(true);
        try {
          const user = await getUsersProfile(token);
          if (!user?.email) {
            showToast({ type: "error", title: "Google sign-in failed", message: "Could not get your email from Google." });
            return;
          }
          const postData = { email: user.email, googleID: user.id };
          const emailCheckResult = await checkEmail(user.email);
          const storedToken = { address: [], orders: [] };

          if (emailCheckResult >= 1) {
            try {
              const userResponse = await emailLoginWithGoogle(postData);
              if (userResponse?.email) {
                await AsyncStorage.setItem(
                  "profile",
                  JSON.stringify({
                    firstName: userResponse.firstName,
                    lastName: userResponse.lastName,
                    phoneNumber: userResponse.phoneNumber,
                    email: userResponse.email,
                    password: userResponse.password,
                    address: storedToken?.address || [],
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
                      address: storedToken?.address || [],
                    },
                  })
                );
                navigation.replace("Loader");
              } else {
                showToast({ type: "error", title: "Invalid input", message: "Check the email or password." });
              }
            } catch (error) {
              showToast({ type: "error", title: "Login failed", message: "An unexpected error occurred." });
            }
          } else {
            showToast({
              type: "error",
              title: "No account found",
              message: "Please sign up first to use Google sign in.",
            });
          }
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [response]);

  function handleScreenPress() {
    Keyboard.dismiss();
  }

  function handleEmailChange(value) {
    setEmail(value.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() && !emailRegex.test(value.trim())) {
      setWarning("Provide a valid email address");
    } else {
      setWarning("");
    }
  }

  function numberHandler() {
    navigation.navigate("NumberLogin");
  }

  function signUpHandler() {
    navigation.navigate("CreateAccount");
  }

  const saveTokenToAsyncStorageLocal = async (authToken) => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      await AsyncStorage.setItem("onboarded", "true");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const loginWithEmail = async () => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/v1/users/login`,
        { email: email.trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );
      const authToken = res.data.token;
      await saveTokenToAsyncStorageLocal(authToken);
      return { user: res.data.data.user };
    } catch (err) {
      return {
        error: err?.response?.data?.message || err?.message || "Invalid email or password",
      };
    }
  };

  async function pressHandler() {
    handleScreenPress();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setWarning("Provide a valid email address");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setWarning("Provide a valid email address");
      return;
    }
    setWarning("");
    if (password.length < 8) {
      showToast({ type: "error", title: "Invalid password", message: "Password must be at least 8 characters." });
      return;
    }

    setIsLoading(true);
    const loginResult = await loginWithEmail();

    if (loginResult?.user) {
      const userResponse = loginResult.user;
      const storedToken = { address: [], orders: [] };
      try {
        await AsyncStorage.setItem(
          "profile",
          JSON.stringify({
            firstName: userResponse.firstName,
            lastName: userResponse.lastName,
            phoneNumber: userResponse.phoneNumber,
            email: userResponse.email,
            password: userResponse.password,
            address: storedToken.address || [],
          })
        );
      } catch (error) {
        console.error("Error saving profile:", error);
      }
      dispatch(
        updateProfile({
          id: {
            firstName: userResponse.firstName,
            lastName: userResponse.lastName,
            phoneNumber: userResponse.phoneNumber,
            email: userResponse.email,
            password: userResponse.password,
            address: storedToken.address || [],
          },
        })
      );
      navigation.replace("Loader");
    } else {
      setIsLoading(false);
      showToast({
        type: "error",
        title: "Sign in failed",
        message: loginResult?.error || "Check the email or password.",
      });
    }
  }

  const canContinue = email.trim().length > 0 && password.length >= 8 && !warning;

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
      >
        <StatusBar style="dark" />
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={GREEN} />
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in with your email and password
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputRow}>
                <MaterialIcons
                  name="email"
                  size={22}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {warning ? (
                <Text style={styles.warningText}>{warning}</Text>
              ) : null}

              <View style={styles.inputRow}>
                <MaterialIcons
                  name="lock"
                  size={22}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#888"
                  />
                </Pressable>
              </View>

              <View style={styles.ctaShadowWrap}>
                <Pressable
                  onPress={canContinue ? pressHandler : undefined}
                  style={[styles.ctaPressable, !canContinue && styles.ctaDisabled]}
                  disabled={!canContinue}
                >
                  <LinearGradient
                    colors={
                      canContinue
                        ? GREEN_GRADIENT
                        : ["#9e9e9e", "#b0b0b0", "#c0c0c0"]
                    }
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Sign In</Text>
                    <Image
                      source={require("../assets/Vector.png")}
                      style={styles.ctaArrow}
                    />
                  </LinearGradient>
                </Pressable>
              </View>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
              </View>

              <Pressable
                style={[styles.googleButton, (!request || isLoading) && { opacity: 0.7 }]}
                onPress={() => request && !isLoading && promptAsync()}
                disabled={!request || isLoading}
              >
                <Image
                  source={require("../assets/google.png")}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleLabel}>Continue with Google</Text>
              </Pressable>

              <Pressable onPress={numberHandler} style={styles.numberLinkWrap}>
                <Text style={styles.numberLink}>
                  Sign in with phone number
                </Text>
              </Pressable>

              <View style={styles.footerRow}>
                <Text style={styles.footerPrefix}>New to RoomService?</Text>
                <Pressable onPress={signUpHandler} hitSlop={8}>
                  <Text style={styles.footerSignIn}> Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default EmailLogin;

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
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 28,
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    fontFamily: "Poppins-Regular",
  },
  formSection: {
    flex: 1,
    backgroundColor: "#f8faf8",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f0",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e4e0",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Poppins-Regular",
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  warningText: {
    fontSize: 13,
    color: "#b91c1c",
    fontFamily: "Poppins-Regular",
    marginTop: -8,
    marginBottom: 8,
  },
  ctaShadowWrap: {
    width: "100%",
    borderRadius: 999,
    marginTop: 8,
    marginBottom: 24,
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
  numberLinkWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  numberLink: {
    fontSize: 16,
    color: "#BC6C25",
    fontFamily: "Poppins-SemiBold",
    fontWeight: "700",
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
  footerSignIn: {
    fontSize: 13,
    fontWeight: "700",
    color: "#BC6C25",
    fontFamily: "Poppins-SemiBold",
  },
});
