import { Pressable, StyleSheet, Text, View } from "react-native";

function Pill({ text, type = "pill" , onPress}) {
  const weight = type == "pill" ? "thin" : "bold";
  const radius = type == "pill" ? 50 : 25;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.container, { borderRadius: radius }]}>
        <Text style={[styles.text, {fontWeight: weight}]}>
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
    marginVertical: 8,
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2
  },
  pressed: {
    opacity: 0.5,
  },
  text: { fontSize: 12, color: "#333333" },
});