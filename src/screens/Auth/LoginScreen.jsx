// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import { showToast } from '../../components/common/Toast';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const requestOTPMutation = useMutation({
    mutationFn: (phone) => authAPI.requestOTP(phone),
    onSuccess: () => {
      showToast('success', 'Success', 'OTP sent successfully');
      navigation.navigate('OtpVerif', { phone: phoneNumber }); // Pass phone as 'phone'
    },
    onError: (error) => {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to send OTP');
    },
  });

  const handleNext = () => {
    if (phoneNumber.trim()) {
      requestOTPMutation.mutate(phoneNumber);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you a registered user?</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {requestOTPMutation.isPending ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!phoneNumber.trim() || requestOTPMutation.isPending}
        />
      )}

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>
          Not registered? Click here to register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});