// screens/RegisterScreen.js
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
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../components/common/Toast';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../utils/imageUpload';

const RegisterScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { register, isRegistering } = useAuth();
  const returnData = route.params?.returnData;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    // profileImageUrl: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const imageUrl = await uploadImage(result.assets[0].uri);
        setFormData(prev => ({ ...prev, profileImageUrl: imageUrl }));
        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      showToast('error', 'Error', 'Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      showToast('error', 'Error', 'Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('error', 'Error', 'Please enter your phone number');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      showToast('error', 'Error', 'Password must be at least 6 characters');
      return;
    }
    // if (!formData.profileImageUrl) {
    //   showToast('error', 'Error', 'Please upload a profile image');
    //   return;
    // }

    // Validate password format (at least one uppercase, one number, one special character)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      showToast('error', 'Error', 'Password must contain at least one uppercase letter, one number, and one special character');
      return;
    }

    try {
      // Register with all required fields
      await register(formData);

      // Add small delay before navigation
await new Promise(resolve => setTimeout(resolve, 500));
      // Navigate to OTP verification
      navigation.navigate('OtpVerif', {
        phone: formData.phone,
        returnData,
        isNewUser: true,
      });
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity> */}

          <Text style={styles.title}>{t('AUTH.CREATE_ACCOUNT')}</Text>
          <Text style={styles.subtitle}>{t('AUTH.FILL_DETAILS')}</Text>

          <View style={styles.form}>
            {/* <TouchableOpacity 
              style={styles.imageUpload}
              onPress={handleImagePick}
              disabled={isUploading}
            >
              {formData.profileImageUrl ? (
                <Image 
                  source={{ uri: formData.profileImageUrl }} 
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  {isUploading ? (
                    <ActivityIndicator color="#16A34A" />
                  ) : (
                    <Text style={styles.uploadText}>{t('AUTH.UPLOAD_PHOTO')}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity> */}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('AUTH.NAME')}</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder={t('AUTH.ENTER_NAME')}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('AUTH.PHONE')}</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="03XX-XXXXXXX"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('AUTH.PASSWORD')}</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                placeholder="Password (e.g., User@1)"
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Must contain uppercase, number, and special character
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, (isRegistering || isUploading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isRegistering || isUploading}
            >
              {isRegistering ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('AUTH.REGISTER')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  },
  backButton: {
    marginTop: 48,
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
  imageUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 8,
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
  helperText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginTop: 4,
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
});

export default RegisterScreen;