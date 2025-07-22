import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, I18nManager } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

export default function SellProductForm() {
  const { t } = useTranslation();
  const [product, setProduct] = useState({
    title: '',
    price: '',
    currency: 'YER',
    // Add other fields as needed
  });

  const [images, setImages] = useState([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('SELL_FORM.PRODUCT_NAME')}
        value={product.title}
        onChangeText={(text) => setProduct({ ...product, title: text })}
        style={styles.input}
      />

      {/* Add more form fields here using t('SELL_FORM.FIELD_KEY') as needed */}

      <Button 
        title={t('COMMON.SUBMIT')} 
        onPress={() => console.log('Submit')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    fontFamily: 'Tajawal-Regular',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 16,
  },
});
