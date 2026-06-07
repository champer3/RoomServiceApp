import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import Text from "../components/Text";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URL } from "../config";
import { useToast } from "../context/ToastContext";

const GREEN_GRADIENT = ["#4a8f5c", "#5a9f6a", "#6faf7a"];

function CompleteProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const profile = useSelector((state) => state.profileData.profile);

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  const saveTokenAndProfile = async (token, userData) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("onboarded", "true");
      const profileData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
        address: userData.address || [],
      };
      await AsyncStorage.setItem("profile", JSON.stringify(profileData));
      dispatch(updateProfile({ id: profileData }));
    } catch (err) {
      console.log("Error saving auth data", err);
    }
  };

  const handleContinue = async () => {
    Keyboard.dismiss();
    if (!canContinue) return;

    const fName = firstName.trim();
    const lName = lastName.trim();
    setIsLoading(true);

    try {
      // Email sign-up: we have email + password in profile
      if (profile?.email && profile?.password) {
        const res = await axios.post(
          `${SERVER_URL}/api/v1/users/signupWithEmail`,
          {
            email: profile.email,
            password: profile.password,
            passwordConfirm: profile.password,
            firstName: fName,
            lastName: lName,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const token = res.data?.token;
        const user = res.data?.data?.user;
        if (token && user) {
          await saveTokenAndProfile(token, user);
          navigation.replace("Loader");
          return;
        }
      }

      // Google sign-up: we have googleID (and email) in profile
      if (profile?.googleID) {
        const res = await axios.post(
          `${SERVER_URL}/api/v1/users/signup`,
          {
            firstName: fName,
            lastName: lName,
            email: profile.email,
            googleID: profile.googleID,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const token = res.data?.token;
        const user = res.data?.data?.user;
        if (token && user) {
          await saveTokenAndProfile(token, user);
          navigation.replace("Loader");
          return;
        }
      }

      // Phone sign-up: we have phoneNumber in profile
      if (profile?.phoneNumber) {
        const res = await axios.post(
          `${SERVER_URL}/api/v1/users/signup`,
          {
            firstName: fName,
            lastName: lName,
            phoneNumber: profile.phoneNumber,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const token = res.data?.token;
        const user = res.data?.data?.user;
        if (token && user) {
          await saveTokenAndProfile(token, user);
          navigation.replace("Loader");
          return;
        }
      }

      showToast({ type: "error", title: "Error", message: "Unable to complete sign up. Please try again." });
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong.";
      showToast({ type: "error", title: "Sign up failed", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#2d5c3c" />
        </View>
      ) : (
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>
            Let&apos;s personalize your experience
          </Text>
        </View>

        <View style={styles.field}>
          <MaterialIcons
            name="person-outline"
            size={22}
            color="#6b7280"
            style={styles.fieldIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#9ca3af"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <MaterialIcons
            name="person-outline"
            size={22}
            color="#6b7280"
            style={styles.fieldIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#9ca3af"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.ctaShadowWrap}>
          <Pressable
            onPress={canContinue ? handleContinue : undefined}
            disabled={!canContinue}
            style={[styles.ctaPressable, !canContinue && styles.ctaDisabled]}
          >
            <LinearGradient
              colors={
                canContinue ? GREEN_GRADIENT : ["#9e9e9e", "#b0b0b0", "#c0c0c0"]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
      )}
    </View>
  );
}

export default CompleteProfile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    paddingTop: 110,
    paddingHorizontal: 24,
  },
  headerBlock: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "Poppins-Regular",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins-Regular",
    paddingVertical: 0,
  },
  ctaShadowWrap: {
    width: "100%",
    borderRadius: 999,
    marginTop: 16,
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
});

