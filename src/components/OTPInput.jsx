// src/components/OTPInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OTPInput = ({ code, setCode, length = 6 }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(''));

  useEffect(() => {
    if (code) {
      const codeArray = code.split('').slice(0, length);
      setOtp([...codeArray, ...Array(length - codeArray.length).fill('')]);
    }
  }, [code]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Join all OTP digits and pass to parent
    const otpCode = newOtp.join('');
    setCode(otpCode);
    
    // Auto focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
  },
});

export default OTPInput;