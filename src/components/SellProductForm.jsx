import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ar from '../locales/ar';

export default function SellProductForm() {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    currency: 'YER',
    // other fields
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
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="اسم المنتج"
        value={product.title}
        onChangeText={(text) => setProduct({...product, title: text})}
        style={{ 
          fontFamily: 'Tajawal-Regular',
          textAlign: 'right'
        }}
      />
      
      <Button 
        title={ar.COMMON.SUBMIT}
        onPress={() => console.log('Submit')}
      />
    </View>
  );
}