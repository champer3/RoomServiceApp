import { Pressable, StyleSheet, View,TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../Text';
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
        styles.container
       }
    ><TouchableOpacity onPress={handleDecrementCounter} disabled={minValue == 1} style={[styles.button, styles.leftButton]}>
    <AntDesign name="minus" size={17} color={minValue != 1 ? 'black' : "#aaa"} />
  </TouchableOpacity>
  <Text style={styles.quantityText}>{minValue}</Text>
  <TouchableOpacity onPress={handleIncrementCounter} style={[styles.button, styles.rightButton]}>
  <AntDesign name="plus" size={17} color="#BC6C25" />
  </TouchableOpacity>
      {/* <Pressable onPress={
          handleDecrementCounter
        } style={({ pressed }) => pressed && { opacity: 0.5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50 }}>
        <View style={{alignItems: 'center', justifyContent: 'center',  borderRadius: 200, borderWidth: 0 }}><AntDesign name="minus" size={20} color="black" /></View>
        
      </Pressable>
      <Text style={{color: 'black',  fontSize: 16, marginHorizontal: 6}}>{minValue}</Text>
      <Pressable onPress={
          handleIncrementCounter
        } style={({ pressed }) => pressed && { opacity: 0.5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{padding: 0, borderRadius: 100, width: 'auto' , alignItems: 'center', justifyContent: 'center', }}><AntDesign name="plus" size={17} color="black" /></View>
      </Pressable> */}
    </View>
  );
}

export default IncrementDecrementBton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
      // iOS shadow properties
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 }, // shadow towards the top
  shadowOpacity: 0.3,
  shadowRadius: 6,
  // Android elevation
  elevation: 6,
    alignItems: 'center',
    backgroundColor: '#F7F8FA', // Light background color
    borderRadius: 25, // Rounded corners for the whole component
  },
  button: {
    paddingHorizontal: 9,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#E9E9F1',
  },
  nutritionItem: {
    alignItems: 'center',
    marginRight: 20, 
    width: '33.33%'
  },
  label: {
    fontSize: 14,
    color: '#777', // Light gray for label
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Darker color for value
  },
  rightButton: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#E9E9F1', // Color for the right button
  },
  buttonText: {
    fontSize: 18,
    color: '#4A4A4A',
  },
  quantityText: {
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 10,
  },
});
