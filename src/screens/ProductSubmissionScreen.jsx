import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import ImageUploader from '../utils/imageUpload';
import CurrencyPicker from '../components/CurrencyPicker';
import { navigate } from '../navigation/navigationHelper';
import ar from '../locales/ar';

export default function ProductSubmissionScreen() {
  const [product, setProduct] = useState({
    type: '',
    condition: 'new',
    title: '',
    description: '',
    price: '',
    currency: 'YER',
    brand: '',
    governorate: '',
    city: '',
    phone: '',
    images: []
  });

  const handleSubmit = () => {
    // This would normally go to verification
    navigate('Verification', { productData: product });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>معلومات المنتج</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>نوع المنتج</Text>
        <Picker
          selectedValue={product.type}
          onValueChange={(value) => setProduct({...product, type: value})}
          style={styles.picker}
        >
          <Picker.Item label="اختر نوع المنتج" value="" />
          <Picker.Item label="ألواح شمسية" value="panel" />
          <Picker.Item label="انفرتر" value="inverter" />
          <Picker.Item label="بطارية" value="battery" />
          <Picker.Item label="ملحقات" value="accessory" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>حالة المنتج</Text>
        <View style={styles.conditionOptions}>
          {['new', 'used', 'needs_repair'].map(cond => (
            <TouchableOpacity
              key={cond}
              style={[
                styles.conditionOption,
                product.condition === cond && styles.selectedCondition
              ]}
              onPress={() => setProduct({...product, condition: cond})}
            >
              <Text style={styles.conditionText}>
                {cond === 'new' ? 'جديد' : 
                 cond === 'used' ? 'مستعمل' : 'يحتاج إصلاح'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>السعر</Text>
        <View style={styles.priceInputContainer}>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={product.price}
            onChangeText={(text) => setProduct({...product, price: text})}
            placeholder="أدخل السعر"
          />
          <CurrencyPicker
            selected={product.currency}
            onSelect={(currency) => setProduct({...product, currency})}
          />
        </View>
      </View>

      <ImageUploader 
        images={product.images}
        onImagesChange={(images) => setProduct({...product, images})}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{ar.COMMON.SUBMIT}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  // ... styling for form elements
};