import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const CartButton = ({ onPress, itemCount }) => {
  return (
      <TouchableOpacity onPress={onPress}>
        <Fontisto name="shopping-basket" size={34} color="black" />
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
        )}
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Adjust as needed
    right: 50, // Adjust as needed
    zIndex: 1000, // Ensure it is above other components
  },
  button: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add elevation for Android shadow
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 9,
    backgroundColor: 'white',
    borderRadius: 1000,
    width: 21,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#283618',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default CartButton;
