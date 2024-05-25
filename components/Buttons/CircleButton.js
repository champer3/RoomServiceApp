import { Pressable, StyleSheet, View, Text } from "react-native";

function CircleButton({ children, borderRadius, background, color, opacity, width , onPress}) {
  return (
    <Pressable
    onPress={onPress}
      style={[
        styles.buttonContainer,
        {
          opacity: opacity,
          borderColor: color,
          backgroundColor: background ? background : "white",
          borderWidth: width ?? 1,
        },
      ]}
    >
        <View style={styles.buttonText}>{children}</View>

    </Pressable>
  );
}

export default CircleButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    padding: 6,
    borderRadius: 100,
    alignItems: "center",
    marginVertical: 4
  },
  buttonText: {
    flex: 1,
    flexDirection: "row",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
});
