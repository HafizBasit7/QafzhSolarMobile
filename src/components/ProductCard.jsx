import { View, Text, Image, StyleSheet } from 'react-native';
import ar from '../locales/ar';

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.price}>
          {product.price} {ar.CURRENCIES[product.currency]}
        </Text>
        <Text style={styles.location}>{product.location}</Text>
        <Text style={styles.condition}>
          {product.condition === 'new' ? 'جديد' : 
           product.condition === 'used' ? 'مستعمل' : 'يحتاج إصلاح'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... card styling
});