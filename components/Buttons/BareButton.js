import { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";

function BareButton({ children, borderRadius, background, color, opacity }) {
  const [pressed, setPressed] = useState(false)

  function pressHandler(){
    setPressed(true)
  }
  function pressOut(){
    setPressed(false)
  }

  return (
    <View
      style={[
        styles.buttonContainer,
        {
          opacity: opacity,
          borderColor: color,
          borderRadius: borderRadius ? borderRadius : 30,
          backgroundColor: background ? background : "white"
        },
      ]}
    >
      <Pressable onPressIn={pressHandler} onPressOut={pressOut}>
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
    borderWidth: 1,
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
