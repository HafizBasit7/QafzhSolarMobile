// src/screens/VerificationScreen.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import OTPInput from "../components/OTPInput"; // Make sure path is correct

// Mock verification function
const verifyOTP = async (code) => {
  // Replace with your actual verification logic
  return code.length === 6; // Simple mock: just checks if 6 digits entered
};

export default function VerificationScreen({ route, navigation }) {
  const { productData, onVerificationSuccess } = route.params || {};
  const [code, setCode] = useState('');

  const handleVerification = async () => {
    try {
      if (code.length !== 6) {
        alert('الرجاء إدخال الكود المكون من 6 أرقام');
        return;
      }

      const isVerified = await verifyOTP(code);
      
      if (isVerified) {
        if (onVerificationSuccess) {
          onVerificationSuccess();
        } else {
          navigation.navigate("Marketplace");
        }
      } else {
        alert('كود التحقق غير صحيح');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('حدث خطأ أثناء التحقق');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        يرجى تأكيد رقم الهاتف لإتمام عملية النشر
      </Text>
      
      <OTPInput 
        code={code}
        setCode={setCode}
        length={6} // You can adjust OTP length
      />
      
      <TouchableOpacity 
        style={styles.verifyButton}
        onPress={handleVerification}
      >
        <Text style={styles.verifyButtonText}>تأكيد</Text>
      </TouchableOpacity>
    </View>
  );
}

// Keep your existing styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Tajawal-Bold'
  },
  verifyButton: {
    backgroundColor: '#16A34A',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold'
  }
});