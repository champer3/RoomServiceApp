import { Pressable, StyleSheet, View, Text } from "react-native";

function BareButton({ children, borderRadius, color, opacity }) {
  return (
    <View
      style={[
        styles.buttonContainer,
        {
          opacity: opacity,
          borderColor: color,
          borderRadius: borderRadius ? borderRadius : 30
        },
      ]}
    >
      <Pressable>
        <View style={styles.buttonText}>{children}</View>
      </Pressable>
    </View>
  );
}

export default BareButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 15,
    backgroundColor: "white",
    borderWidth: 2,
    padding: 10,
    borderRadius: 30,
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
