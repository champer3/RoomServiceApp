import { Pressable, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';

function IncrementDecrementBton({ minValue = 0, maxValue = 100, onIncrease, onDecrease }) {
   

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
        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 200, borderWidth: 0 }}><AntDesign name="minuscircle" size={32} color="#BC6C25" /></View>
        
      </Pressable>
      <Text style={{color: 'white', fontWeight: 600, fontSize: 12}}>{minValue}</Text>
      <Pressable onPress={
          handleIncrementCounter
        } style={({ pressed }) => pressed && { opacity: 0.5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{padding: 0,backgroundColor: 'white', borderRadius: 100, width: 'auto' , }}><AntDesign name="pluscircle" size={32} color="#BC6C25" /></View>
      </Pressable>
    </View>
  );
}

export default IncrementDecrementBton;

const styles = StyleSheet.create({
  buttonContainer: {
    // marginVertical: 20,
    backgroundColor: "#BC6C25",
    width: 'auto',
    height: 32,
    borderRadius: 24,
    gap: 7,
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
