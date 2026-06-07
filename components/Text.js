import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Text = ({ style, ...props }) => {
  const { colors } = useTheme();
  return <RNText style={[styles.text, { color: colors.text }, style]} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
  },
});

export default Text;
