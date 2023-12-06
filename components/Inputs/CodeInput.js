import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CodeInput = ({ length = 8 }) => {
  const [passcode, setPasscode] = useState('');

  const handleInputChange = (value) => {
    // Ensure the input length doesn't exceed the specified length
    if (value.length <= length) {
      setPasscode(value);

      // If the input length reaches the specified length, trigger onInputComplete callback

  };}

  return (
    <View style={styles.container}>
      {[...Array(length)].map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={passcode[index] || ''}
          maxLength={1}
          keyboardType="numeric"
          returnKeyType='done'
          onChangeText={(value) => handleInputChange(value)}
        />
      ))}
    </View>
  );
};
export default CodeInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: "14%",
    height: 52,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
