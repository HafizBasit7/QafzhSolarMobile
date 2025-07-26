import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import { useTranslation } from 'react-i18next';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');

  const requestOTPMutation = useMutation({
    mutationFn: (phone) => authAPI.requestOTP(phone),
    onSuccess: () => {
      showToast('success', t('COMMON.SUCCESS'), t('AUTH.OTP_SENT'));
      navigation.navigate('OtpVerif', { phone: phoneNumber });
    },
    onError: (error) => {
      showToast('error', t('COMMON.ERROR'), error.response?.data?.message || t('AUTH.OTP_FAILED'));
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('AUTH.WELCOME_BACK')}</Text>
          <Text style={styles.subtitle}>{t('AUTH.ENTER_PHONE_PROMPT')}</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('AUTH.PHONE')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('AUTH.PHONE_PLACEHOLDER')}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, (!phoneNumber.trim() || requestOTPMutation.isPending) && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!phoneNumber.trim() || requestOTPMutation.isPending}
            >
              {requestOTPMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('COMMON.NEXT')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister} style={styles.registerLink}>
              <Text style={styles.registerText}>
                {t('AUTH.NO_ACCOUNT')}{' '}
                <Text style={styles.registerHighlight}>{t('COMMON.REGISTER')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#1E293B',
  },
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
  },
  registerHighlight: {
    color: '#16A34A',
    fontFamily: 'Tajawal-Bold',
  },
});
