import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ar from '../locales/ar';

export default function ProductDetailScreen() {
  const route = useRoute();
  const { product } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <ScrollView horizontal pagingEnabled>
        {product.images.map((img, index) => (
          <Image 
            key={index}
            source={{ uri: img }}
            style={styles.productImage}
          />
        ))}
      </ScrollView>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>
          {product.price} {ar.CURRENCIES[product.currency]}
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>النوع:</Text>
          <Text style={styles.detailValue}>{product.type}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>الحالة:</Text>
          <Text style={styles.detailValue}>
            {product.condition === 'new' ? 'جديد' : 
             product.condition === 'used' ? 'مستعمل' : 'يحتاج إصلاح'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>الموقع:</Text>
          <Text style={styles.detailValue}>
            {product.city}, {product.governorate}
          </Text>
        </View>

        {/* Contact Seller */}
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>اتصال بالبائع: {product.phone}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  // ... styling for product detail
};