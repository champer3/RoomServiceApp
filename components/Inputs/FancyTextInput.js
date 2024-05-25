import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const { width: screenWidth } = Dimensions.get('window');
const FancyTextInput = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Special Instructions?"
        multiline
        numberOfLines={8}
        clearButtonMode="always"
        placeholderTextColor="#888"
        cursorColor={'#aaa'}
      />
    <TouchableOpacity style={styles.doneButton}>
    <MaterialCommunityIcons name="send-circle-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        marginTop: 50,
      alignItems: 'center', // Center the TextInput container
    },
    textInputContainer: {
      width: '100%', // Use percentage for responsive design
      maxWidth: screenWidth * 0.9, // Ensure the width is 90% of the screen width
      position: 'relative', // Make the container a positioning reference for the button
    },
    textInput: {
      fontSize: 16,
      fontWeight: "500",
      width: '100%', // Full width within the container
      height: 150, // Adjust height as needed
      borderColor: '#fff', // Fancy border color
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      backgroundColor: '#fff',
      textAlignVertical: 'top',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
    },
    doneButton: {
      position: 'absolute',
      bottom: 10, // Position the button slightly above the bottom edge
      right: 10, // Position the button slightly to the left of the right edge
      backgroundColor: '#aaa', // Button background color
      borderRadius: 105,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
    },
    doneButtonText: {
      color: '#fff',
      fontWeight: "500",
    },
  });
  
export default FancyTextInput;
