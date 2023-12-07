import { Pressable, StyleSheet, View, Text } from "react-native";

function Button({ children, color, opacity }) {
  return (
    <View
      style={[
        styles.buttonContainer,
        {
          backgroundColor: color ? color : "#283618",
          opacity: opacity,
        },
      ]}
    >
      <Pressable>
        <View style={styles.buttonText}>{children}</View>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    // marginVertical: 20,
    // marginHorizontal: 15,
    backgroundColor: "#283618",
    padding: 10,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: {
    flex: 1,
    flexDirection: "row",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});
