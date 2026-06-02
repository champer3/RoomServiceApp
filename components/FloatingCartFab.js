import { Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

/**
 * Bottom-right cart FAB aligned with Home / Department screens (above tab bar).
 */
export default function FloatingCartFab({ count, onPress, bottomOffset = 102 }) {
  if (!count || count < 1) return null;
  return (
    <Pressable
      style={[styles.fab, { bottom: bottomOffset }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open cart, ${count} items`}
    >
      <Feather name="shopping-bag" size={18} color="#FFFFFF" />
      <Text style={styles.countText}>{count > 99 ? "99+" : String(count)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    zIndex: 40,
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
