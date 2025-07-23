import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../components/common/Toast';
import { useTranslation } from 'react-i18next';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { verifyOTP, isVerifying, register } = useAuth();
  const { phone, returnData } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      await register(phone);
      setTimer(60);
      showToast('success', 'Success', 'OTP sent successfully');
    } catch (error) {
      showToast('error', 'Error', error.message || 'Failed to resend OTP');
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showToast('error', 'Error', 'Please enter complete OTP');
      return;
    }

    try {
      await verifyOTP(phone, otpString);
      if (returnData) {
        // If we have return data, go back to the previous screen
        navigation.goBack();
      } else {
        // Otherwise, go to the main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      }
    } catch (error) {
      showToast('error', 'Error', error.message || 'Invalid OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('AUTH.VERIFY_PHONE')}</Text>
        <Text style={styles.subtitle}>
          {t('AUTH.OTP_SENT_TO')} {phone}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isVerifying && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('AUTH.VERIFY')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, timer > 0 && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={timer > 0}
        >
          <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
            {timer > 0
              ? `${t('AUTH.RESEND_IN')} ${timer}s`
              : t('AUTH.RESEND_OTP')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#475569',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
  },
  resendButton: {
    alignItems: 'center',
    padding: 12,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: '#16A34A',
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
  },
  resendTextDisabled: {
    color: '#94A3B8',
  },
});

export default OTPVerificationScreen; 