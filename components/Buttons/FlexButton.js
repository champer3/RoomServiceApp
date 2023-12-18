import { Pressable, StyleSheet, View, Text } from "react-native";

function FlexButton({ children, borderRadius, background, color, opacity, width , onPress}) {
  return (
    <Pressable
    onPress={onPress}
      style={[
        styles.buttonContainer,
        {
          opacity: opacity,
          borderColor: color,
          borderRadius: borderRadius ? borderRadius : 30,
          backgroundColor: background ? background : "white",
          borderWidth: width ?? 1,
        },
      ]}
    >
        <View style={styles.buttonText}>{children}</View>

    </Pressable>
  );
}

export default FlexButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal: 24,
    borderRadius: 30,
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
