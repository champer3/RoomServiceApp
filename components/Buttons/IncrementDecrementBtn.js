import { Pressable, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

function IncrementDecrementBtn({ minValue = 0, maxValue = 100, onIncrease, onDecrease }) {
   

  const handleIncrementCounter = () => {
    if (minValue < maxValue) {
      onIncrease()
    }
  };

  const handleDecrementCounter = () => {
    onDecrease()
  };

    return (
    <View
      style={
        styles.buttonContainer
       }
    >
      <Pressable onPress={
          handleDecrementCounter
        } style={({ pressed }) => pressed && { opacity: 0.5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50 }}>
        <View style={{alignItems: 'center', justifyContent: 'center' }}><Feather name="minus" size={20} color="black" /></View>
        
      </Pressable>
      <Text>{minValue}</Text>
      <Pressable onPress={
          handleIncrementCounter
        } style={({ pressed }) => pressed && { opacity: 0.5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{alignItems: 'center', justifyContent: 'center' }}><MaterialIcons name="add" size={20} color="black" /></View>
      </Pressable>
    </View>
  );
}

export default IncrementDecrementBtn;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    // marginVertical: 20,
    // marginHorizontal: 15,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: 'space-around',
  },
  buttonText: {
    
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});
