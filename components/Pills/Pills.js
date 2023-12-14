import { Pressable, StyleSheet, Text, View } from "react-native";

function Pill({ text, type = "pill" }) {
  const weight = type == "pill" ? "thin" : "bold";
  const radius = type == "pill" ? 50 : 25;
  return (
    <Pressable style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.container, { borderRadius: radius }]}>
        <Text style={[styles.text, { fontWeight: weight }]}>
          {text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null}
        </Text>
      </View>
    </Pressable>
  );
}

export default Pill;
const styles = StyleSheet.create({
  container: {
    flex: -1,
    backgroundColor: "#f9f3cf59",
<<<<<<< HEAD
    marginVertical: 10,
    padding: 17,
=======
    marginVertical: 6,
    marginHorizontal: 6,
    padding: 12,
>>>>>>> 413e93100796a5d736697758c9766bc137e1b26f
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5,
  },
  text: { fontSize: 16, color: "#333333" },
});
