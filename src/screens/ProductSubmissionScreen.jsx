import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Switch,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { governorates } from '../../data/governorates'

const colors = {
  primary: '#2E7D32',
  primaryLight: '#81C784',
  background: '#F5F5F5',
  white: '#FFFFFF',
  textPrimary: '#212121',
  border: '#E0E0E0',
  error: '#D32F2F',
};

const ProductSubmissionScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Panel',
    condition: 'New',
    brand: '',
    model: '',
    price: '',
    currency: 'USD',
    phone: user?.phone || '',
    whatsappPhone: '',
    governorate: "Sana'a",
    city: '',
    locationText: '',
    images: [],
    specifications: {
      power: '',
      voltage: '',
      capacity: '',
      warranty: ''
    },
    isNegotiable: true,
    isActive: true,
    featured: false,
    status: 'pending'
  });

  const productTypes = ['Panel', 'Inverter', 'Battery', 'Accessory'];
  const conditions = ['New', 'Used', 'Refurbished'];
  const currencies = ['USD', 'YER', 'SAR'];
  const governorates = ["Sana'a", 'Aden', 'Taiz', 'Hodeidah', 'Ibb'];
  const cities = ["Crater", "Mualla", "Tawahi", "Sheikh Othman", "Mansoura", "Dar Saad", "Al Buraiqa", "Khour Maksar"]

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('common.permissionRequired'), t('productSubmission.photoPermission'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setFormData({
        ...formData,
        images: [...formData.images, ...result.assets.map(asset => asset.uri)]
      });
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSpecChange = (field, value) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [field]: value
      }
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert(t('common.error'), t('productSubmission.nameRequired'));
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      Alert.alert(t('common.error'), t('productSubmission.validPrice'));
      return false;
    }
    // if (formData.images.length === 0) {
    //   Alert.alert(t('common.error'), t('productSubmission.imageRequired'));
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        userId: user._id
      });
      
      // Success handled in the mutation's onSuccess callback
      // navigation.goBack();
    } catch (error) {
      // Error handled in the mutation's onError callback
      console.error('Submission error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('productSubmission.title')}</Text>
      
      {/* Basic Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('productSubmission.basicInfo')}</Text>
        
        <InputField
          label={`${t('productSubmission.name')} *`}
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          placeholder={t('productSubmission.namePlaceholder')}
        />
        
        <InputField
          label={t('productSubmission.description')}
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
          placeholder={t('productSubmission.descriptionPlaceholder')}
          multiline
          numberOfLines={4}
        />
        
        <DropdownField
          label={t('productSubmission.type')}
          selectedValue={formData.type}
          onValueChange={(itemValue) => setFormData({...formData, type: itemValue})}
          items={productTypes}
        />
        
        <DropdownField
          label={t('productSubmission.condition')}
          selectedValue={formData.condition}
          onValueChange={(itemValue) => setFormData({...formData, condition: itemValue})}
          items={conditions}
        />
        
        <InputField
          label={t('productSubmission.brand')}
          value={formData.brand}
          onChangeText={(text) => setFormData({...formData, brand: text})}
          placeholder={t('productSubmission.brandPlaceholder')}
        />
        
        <InputField
          label={t('productSubmission.model')}
          value={formData.model}
          onChangeText={(text) => setFormData({...formData, model: text})}
          placeholder={t('productSubmission.modelPlaceholder')}
        />
      </View>
      
      {/* Pricing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('productSubmission.pricing')}</Text>
        
        <View style={styles.row}>
          <View style={{ flex: 0.7 }}>
            <InputField
              label={`${t('productSubmission.price')} *`}
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 0.3 }}>
            <DropdownField
              selectedValue={formData.currency}
              onValueChange={(itemValue) => setFormData({...formData, currency: itemValue})}
              items={currencies}
            />
          </View>
        </View>
        
        <ToggleField
          label={t('productSubmission.negotiable')}
          value={formData.isNegotiable}
          onValueChange={(value) => setFormData({...formData, isNegotiable: value})}
        />
      </View>
      
      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('productSubmission.contactInfo')}</Text>
        
        <InputField
          label={t('productSubmission.phone')}
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
          placeholder={t('productSubmission.phonePlaceholder')}
          keyboardType="phone-pad"
        />
        
        <InputField
          label={t('productSubmission.whatsapp')}
          value={formData.whatsappPhone}
          onChangeText={(text) => setFormData({...formData, whatsappPhone: text})}
          placeholder={t('productSubmission.whatsappPlaceholder')}
          keyboardType="phone-pad"
        />
      </View>
      
      {/* Location Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('productSubmission.location')}</Text>
        
        <DropdownField
          label={t('productSubmission.governorate')}
          selectedValue={formData.governorate}
          onValueChange={(itemValue) => setFormData({...formData, governorate: itemValue})}
          items={governorates}
        />
        
        <DropdownField
          label={t('productSubmission.city')}
          selectedValue={formData.city}
          onValueChange={(cities) => setFormData({...formData, city: cities})}
          placeholder={t('productSubmission.cityPlaceholder')}
          items={cities}
        />
        
        <InputField
          label={t('productSubmission.locationText')}
          value={formData.locationText}
          onChangeText={(text) => setFormData({...formData, locationText: text})}
          placeholder={t('productSubmission.locationPlaceholder')}
        />
      </View>
      
      {/* Specifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('productSubmission.specifications')}</Text>
        
        <InputField
          label={t('productSubmission.power')}
          value={formData.specifications.power}
          onChangeText={(text) => handleSpecChange('power', text)}
          placeholder="550W"
        />
        
        <InputField
          label={t('productSubmission.voltage')}
          value={formData.specifications.voltage}
          onChangeText={(text) => handleSpecChange('voltage', text)}
          placeholder="41V"
        />
        
        <InputField
          label={t('productSubmission.warranty')}
          value={formData.specifications.warranty}
          onChangeText={(text) => handleSpecChange('warranty', text)}
          placeholder="12 Years"
        />
      </View>
      
      {/* Images Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('productSubmission.images')}</Text>
        <Text style={styles.hintText}>{t('productSubmission.imagesHint')}</Text>
        
        <View style={styles.imageContainer}>
          {formData.images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <AntDesign name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          
          {formData.images.length < 5 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="add" size={24} color={colors.primary} />
              <Text style={styles.addImageText}>{t('productSubmission.addImage')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={createProduct.isLoading}
      >
        {createProduct.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {t('productSubmission.submit')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};


// Reusable components
const InputField = ({ label, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const DropdownField = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor={colors.primary}
      >
        {items.map(item => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  </View>
);

const ToggleField = ({ label, value, onValueChange }) => (
  <View style={styles.toggleContainer}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      trackColor={{ false: colors.gray, true: colors.primaryLight }}
      thumbColor={value ? colors.primary : colors.lightGray}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    marginTop: 8,
    color: colors.primary,
    fontSize: 12,
  },
  hintText: {
    fontSize: 12,
    color: colors.textHint,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductSubmissionScreen;