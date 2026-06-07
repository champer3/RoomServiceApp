import { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Animated, Easing, Vibration, Pressable } from "react-native";
import Text from "../Text";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

function OrderSuccess({ onPress, onMove }) {
  const scaleCard = useRef(new Animated.Value(0.85)).current;
  const opacityCard = useRef(new Animated.Value(0)).current;
  const scaleCheck = useRef(new Animated.Value(0)).current;
  const rotateCheck = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.4)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const confettiY = useRef([...Array(8)].map(() => new Animated.Value(0))).current;
  const confettiX = useRef([...Array(8)].map(() => new Animated.Value(0))).current;
  const confettiOpacity = useRef([...Array(8)].map(() => new Animated.Value(0))).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Vibration.vibrate([0, 80, 100, 80]);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleCard, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(opacityCard, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(scaleCheck, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
        Animated.timing(rotateCheck, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 2.2, duration: 600, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    // Confetti burst
    setTimeout(() => {
      confettiY.forEach((anim, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 60 + Math.random() * 40;
        Animated.parallel([
          Animated.sequence([
            Animated.timing(confettiOpacity[i], { toValue: 1, duration: 80, useNativeDriver: true }),
            Animated.timing(confettiOpacity[i], { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
          ]),
          Animated.timing(anim, { toValue: -Math.sin(angle) * dist, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(confettiX[i], { toValue: Math.cos(angle) * dist, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();
      });
    }, 500);

    // Buttons fade in
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(btnSlide, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    }, 800);
  }, []);

  const checkRotation = rotateCheck.interpolate({
    inputRange: [0, 1],
    outputRange: ["-45deg", "0deg"],
  });

  const CONFETTI_COLORS = ["#BC6C25", "#283618", "#F59E0B", "#16A34A", "#3B82F6", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <Animated.View style={[styles.card, { opacity: opacityCard, transform: [{ scale: scaleCard }] }]}>
      {/* Ring pulse */}
      <Animated.View style={[styles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />

      {/* Confetti particles */}
      {confettiY.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              backgroundColor: CONFETTI_COLORS[i],
              opacity: confettiOpacity[i],
              transform: [{ translateY: confettiY[i] }, { translateX: confettiX[i] }],
            },
          ]}
        />
      ))}

      {/* Check icon */}
      <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleCheck }, { rotate: checkRotation }] }]}>
        <Ionicons name="checkmark-sharp" size={40} color="#fff" />
      </Animated.View>

      <Text style={styles.title}>Order placed!</Text>
      <Text style={styles.subtitle}>Your order is confirmed and will be on its way shortly</Text>

      <Animated.View style={[styles.btnWrap, { opacity: btnOpacity, transform: [{ translateY: btnSlide }] }]}>
        <Pressable onPress={onPress} style={styles.primaryBtn}>
          <Ionicons name="receipt-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>View order</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default OrderSuccess;

const styles = StyleSheet.create({
  card: {
    width: width - 48,
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  ring: {
    position: "absolute",
    top: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(188,108,37,0.35)",
  },
  confetti: {
    position: "absolute",
    top: 72,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  btnWrap: {
    width: "100%",
    gap: 10,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(188,108,37,0.94)",
    borderRadius: 999,
    paddingVertical: 15,
    shadowColor: "#BC6C25",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  secondaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingVertical: 15,
  },
  secondaryBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#374151",
  },
});
