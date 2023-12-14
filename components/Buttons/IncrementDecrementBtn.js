import { Pressable, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

function IncrementDecrementBtn({ minValue = 0, maxValue = 100 }) {
    const [count, setCount] = useState(minValue);

  const handleIncrementCounter = () => {
    if (count < maxValue) {
      setCount((prevState) => prevState + 1);
    }
  };

  const handleDecrementCounter = () => {
    if (count > minValue) {
      setCount((prevState) => prevState - 1);
    }
  };

    return (
    <View
      style={
        styles.buttonContainer
       }
    >
      <Pressable>
        <View><Feather name="minus" size={24} color="black" /></View>
        
      </Pressable>
      <Text>{count}</Text>
      <Pressable onPress={() => {
          handleIncrementCounter;
        }}>
        <View><MaterialIcons name="add" size={24} color="black" /></View>
      </Pressable>
    </View>
  );
}

export default IncrementDecrementBtn;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: -1,
    // marginVertical: 20,
    // marginHorizontal: 15,
    backgroundColor: "#283618",
    padding: 10,
    borderRadius: 24,
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});
