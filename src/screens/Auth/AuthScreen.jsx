import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../components/common/Toast';
import { useTranslation } from 'react-i18next';

const AuthScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { register, isRegistering, checkPhone } = useAuth();
  const [phone, setPhone] = useState('');
  const returnData = route.params?.returnData;

  const handleSubmit = async () => {
    if (!phone.trim()) {
      showToast('error', 'Error', 'Please enter your phone number');
      return;
    }

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+967${formattedPhone.replace(/^0+/, '')}`;
    }

    try {
      // First check if user exists
      const userExists = await checkPhone(formattedPhone);
      
      if (userExists) {
        // User exists - request OTP
        await register(formattedPhone);
        showToast('success', 'Success', 'OTP sent to registered number');
      } else {
        // New user - register and get OTP
        await register(formattedPhone);
        showToast('success', 'Success', 'Account created and OTP sent');
      }
      
      // Navigate to OTP screen in both cases
      navigation.navigate('OTPVerification', { 
        phone: formattedPhone, 
        returnData,
        isNewUser: !userExists
      });
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Image
          source={require('../../../assets/images/solar1.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>{t('AUTH.WELCOME')}</Text>
        <Text style={styles.subtitle}>{t('AUTH.ENTER_PHONE')}</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('AUTH.PHONE')}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+967 XXX XXX XXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isRegistering}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isRegistering && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('AUTH.CONTINUE')}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            {t('AUTH.TERMS_PREFIX')}{' '}
            <Text style={styles.termsLink}>{t('AUTH.TERMS')}</Text>
            {' '}{t('AUTH.AND')}{' '}
            <Text style={styles.termsLink}>{t('AUTH.PRIVACY')}</Text>
          </Text>
        </View>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 32,
    borderRadius: 60,
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
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#475569',
    marginBottom: 8,
    textAlign: 'right',
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
    textAlign: 'right',
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
  terms: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#16A34A',
    textDecorationLine: 'underline',
  },
});

export default AuthScreen; 