import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const Text = ({ style, ...props }) => {
  return <RNText style={[styles.text, style]} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
  },
});

export default Text;
