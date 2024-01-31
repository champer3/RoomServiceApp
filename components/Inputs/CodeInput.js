import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const CodeInput = ({ length = 6 }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [code, setCode] = useState('');

  const otpInputRefs = useRef([]);
  function handleOtp(value){
    const newOtp = [...otp]
    for (var i = 0; i < value.length; i++){
      newOtp[i] = value[i]
    }
    for (var i = value.length; i< otp.length; i++){
      newOtp[i] = ''
    }
    setCode(value)
    setOtp(newOtp)
    
  }
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
       <TextInput
       value={code}
       onChangeText={(value) => {handleOtp(value)}}
       maxLength={length}
       keyboardType="numeric"
       autoComplete="one-time-code" // android
      textContentType="oneTimeCode" // ios
      cursorColor={'rgba(0,0,0,0)'}
      style={{zIndex: 3, position: 'absolute', width: '100%', borderColor: 'black', borderWidth: 0, height: 52, color: 'rgba(0,0,0,0)',}}
      letterSpacing={length * 8}
       />
       
      {otp.map((digit, index) => (
        
        <TextInput
          key={index}
          style={[styles.input, {width : `${100/(length*1.2)}%`}]}
          maxLength={1}
          value={digit}
          keyboardType="numeric"
          ref={(ref) => (otpInputRefs.current[index] = ref)}
          secureTextEntry={true}
          autoComplete="one-time-code" // android
      textContentType="oneTimeCode" // ios
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
    alignItems: 'center',
    gap: 12,
  },
  input: {
    height: 52,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 8,
  },
});
