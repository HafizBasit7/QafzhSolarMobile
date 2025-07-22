import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handlePress = () => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.95} 
      style={styles.card}
      onPress={handlePress}
    >
      {/* Image with Badge and Favorite */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product?.images?.[0] || 'https://via.placeholder.com/300' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.imageOverlay}>
          {product?.condition === 'new' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t(`CONDITIONS.new`)}</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons 
              name={product?.isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={product?.isFavorite ? "#EF4444" : "rgba(255,255,255,0.8)"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {product?.title}
        </Text>
        
        {/* Price and Rating */}
        <View style={styles.priceRatingContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {product?.price} {t(`CURRENCIES.${product?.currency}`)}
            </Text>
            {product?.originalPrice && (
              <Text style={styles.originalPrice}>
                {product.originalPrice} {t(`CURRENCIES.${product?.currency}`)}
              </Text>
            )}
          </View>
        </View>

        {/* Footer with Location and Condition */}
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={styles.location} numberOfLines={1}>
              {product?.location}
            </Text>
          </View>
          
          <View style={[
            styles.conditionTag,
            product?.condition === 'used' && styles.usedTag,
            product?.condition === 'needs_repair' && styles.repairTag
          ]}>
            <Text style={styles.conditionText}>
              {t(`${product?.condition}`)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 12,
  },
  badge: {
    backgroundColor: '#10B981',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    padding: 14,
  },
  title: {
    fontFamily: 'Tajawal-SemiBold',
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'right',
    lineHeight: 22,
  },
  priceRatingContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 17,
    color: '#1E293B',
  },
  originalPrice: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
  },
  conditionTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  usedTag: {
    backgroundColor: '#FEF3C7',
  },
  repairTag: {
    backgroundColor: '#FEE2E2',
  },
  conditionText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: 12,
    color: '#1E3A8A',
  },
});