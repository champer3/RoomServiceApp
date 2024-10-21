import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const ErrorMessage = ({ visible, message }) => {
  const slideAnim = useRef(new Animated.Value(-100))?.current; // Initial position is above the screen

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center', // Center the message horizontally
    zIndex: 1000, // Make sure the message is above other components
  },
  messageContainer: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8, // Add elevation for Android shadow
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
});

export default ErrorMessage;
