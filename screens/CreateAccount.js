import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import Text from "../components/Text";

const { width } = Dimensions.get("window");

function CreateAccount() {
  const navigation = useNavigation();

  function handlePhone() {
    navigation.navigate("AddNumber");
  }

  function handleEmail() {
    navigation.navigate("EmailSignUp");
  }

  function handleGoogle() {
    navigation.navigate("EmailSignUp", { promptGoogle: true });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Choose how you'd like to get started
          </Text>
        </View>

        <View style={styles.buttonStack}>
          <Pressable style={styles.optionButton} onPress={handlePhone}>
            <View style={styles.optionInner}>
              <MaterialIcons
                name="phone-in-talk"
                size={22}
                color="#4b5563"
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>Continue with Phone</Text>
            </View>
          </Pressable>

          <Pressable style={styles.optionButton} onPress={handleEmail}>
            <View style={styles.optionInner}>
              <MaterialIcons
                name="email"
                size={22}
                color="#4b5563"
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>Continue with Email</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <Pressable style={styles.googleButton} onPress={handleGoogle}>
          <View style={styles.googleInner}>
            <Image
              source={require("../assets/google.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </View>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate("NumberLogin")}>
            <Text style={styles.footerLink}> Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default CreateAccount;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8faf8",
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  headerBlock: {
    marginBottom: 32,
    paddingTop: 24,
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
  buttonStack: {
    marginTop: 8,
    marginBottom: 10,
  },
  optionButton: {
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#e0e4e0",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  optionInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins-Regular",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#9ca3af",
    fontFamily: "Poppins-Regular",
  },
  googleButton: {
    borderRadius: 34,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  googleInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  googleIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 10,
  },
  googleLabel: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins-Regular",
  },
  footerRow: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#4b5563",
    fontFamily: "Poppins-Regular",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#BC6C25",
    fontFamily: "Poppins-SemiBold",
  },
});

