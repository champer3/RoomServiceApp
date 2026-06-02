import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Text from "../components/Text";

const { width, height } = Dimensions.get("window");

function StartScreen() {
  const navigation = useNavigation();
  const [isLoading] = useState(false);

  function pressHandler() {
    navigation.replace("Loader");
  }

  function getStartedHandler() {
    navigation.navigate("CreateAccount");
  }

  function signInHandler() {
    navigation.navigate("NumberLogin");
  }

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {/* Full-bleed background — edge to edge, not clipped by padding */}
      <ImageBackground
        source={require("../assets/start_bg.png")}
        style={styles.bgFullBleed}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        {/* Required on some RN versions so the background paints full size */}
        <View style={styles.bgPlaceholder} pointerEvents="none" />
      </ImageBackground>
      <View style={styles.content}>
        {/* Skip — top right, subtle */}
        <Pressable
          onPress={pressHandler}
          style={styles.skipWrap}
          hitSlop={12}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        {/* Hero illustration */}
        <View style={styles.heroWrap}>
          <Image
            source={require("../assets/start_hero.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Copy block */}
        <View style={styles.copyBlock}>
          <Text style={styles.welcomeLabel}>WELCOME TO</Text>
          <Text style={styles.brandTitle}>ROOMSERVICE</Text>
          <Text style={styles.tagline}>
            Everything you need, delivered to your door.
          </Text>
        </View>

        {/* Primary CTA — pill with gradient + arrow (shadow on wrapper so it isn’t clipped) */}
        <View style={styles.ctaShadowWrap}>
          <Pressable
            onPress={getStartedHandler}
            style={styles.ctaPressable}
          >
            <LinearGradient
              colors={["#5a9f6a", "#3d7a4f", "#2d5c3c"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Get Started</Text>
              <Image
                source={require("../assets/Vector.png")}
                style={styles.ctaArrow}
              />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Sign in row */}
        <View style={styles.signInRow}>
          <Text style={styles.signInPrefix}>Already have an account?</Text>
          <Pressable onPress={signInHandler} hitSlop={8}>
            <Text style={styles.signInLink}> Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1a3d2a",
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a3d2a",
  },
  bgFullBleed: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  bgImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  bgPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  skipWrap: {
    alignSelf: "flex-end",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    letterSpacing: 1.2,
    fontFamily: "Poppins-Regular",
  },
  heroWrap: {
    flex: 1,
    minHeight: height * 0.32,
    maxHeight: height * 0.42,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  heroImage: {
    width: width - 32,
    height: "100%",
  },
  copyBlock: {
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  welcomeLabel: {
    color: "#fff",
    fontSize: 13,
    letterSpacing: 3,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },
  brandTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 2,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
  },
  tagline: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    width: 230,
    opacity: 0.95,
    fontFamily: "Poppins-Regular",
    paddingHorizontal: 12,
  },
  ctaShadowWrap: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 999,
    // No overflow — allows shadow to render outside bounds
    ...Platform.select({
      ios: {
        shadowColor: "#0d2818",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
      },
      android: {
        elevation: 12,
        shadowColor: "#000",
      },
    }),
  },
  ctaPressable: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  ctaText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: "Poppins-Bold",
  },
  ctaArrow: {
    width: 22,
    height: 16,
    marginLeft: 10,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  signInPrefix: {
    color: "#fff",
    fontSize: 15,
    opacity: 0.9,
    fontFamily: "Poppins-Regular",
  },
  signInLink: {
    color: "#D4A574",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Poppins-Regular",
  },
});
