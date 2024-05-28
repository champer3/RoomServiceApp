// src/components/Placeholder.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const Placeholder = ({ style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.placeholder,
        { opacity: fadeAnim },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
});

export default Placeholder;
