import { useRef, useEffect } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import Text from "./Text";
import { onCartAdd } from "../utils/cartEvents";

export default function FloatingCartFab({ count, onPress, bottomOffset = 102 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsub = onCartAdd(() => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0.5, duration: 50, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]),
      ]).start();
    });
    return unsub;
  }, [scaleAnim, rotateAnim]);

  if (!count || count < 1) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  return (
    <Animated.View
      style={[
        styles.fabWrap,
        { bottom: bottomOffset, transform: [{ scale: scaleAnim }, { rotate }] },
      ]}
    >
      <Pressable
        style={styles.fab}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open cart, ${count} items`}
      >
        <Feather name="shopping-bag" size={18} color="#FFFFFF" />
        <Text style={styles.countText}>{count > 99 ? "99+" : String(count)}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    position: "absolute",
    right: 18,
    zIndex: 40,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingLeft: 12,
    paddingRight: 12,
    minHeight: 45,
    borderRadius: 999,
    backgroundColor: "#BC6C25",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 10,
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.2,
    minWidth: 20,
    textAlign: "center",
  },
});
