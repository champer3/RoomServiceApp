import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CodeInput = ({ length = 6 }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move focus to the next input field
    if (value === '' && index > 0) {
      // If the current input is empty and not the first one, move focus to the previous input
      otpInputRefs.current[index - 1].focus();
    } else if (index < otp.length - 1 && value !== '') {
      // If the current input is not the last one and not empty, move focus to the next input
      otpInputRefs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.input}
          maxLength={1}
          value={digit}
          onChangeText={(value) => handleOtpChange(index, value)}
          keyboardType="numeric"
          ref={(ref) => (otpInputRefs.current[index] = ref)}
          secureTextEntry={true}
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
