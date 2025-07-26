import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const ProductCard = ({ product, onLike, onUnlike }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleLikePress = () => {
    if (product.isLiked) {
      onUnlike();
    } else {
      onLike();
    }
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="broken-image" size={24} color="#94A3B8" />
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/300' }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator color="#16A34A" />
          </View>
        )}
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLikePress}
          disabled={!user}
        >
          <Ionicons 
            name={product.isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={product.isLiked ? "#EF4444" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderImage()}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.details}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {formatPrice(product.price)} {product.currency}
            </Text>
            {product.isNegotiable && (
              <Text style={styles.negotiable}>{t('PRODUCT.negotiable')}</Text>
            )}
          </View>

          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={12} color="#64748B" />
            <Text style={styles.location} numberOfLines={1}>
              {product.city}, {product.governorate}
            </Text>
          </View>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles[`${product.condition}Badge`]]}>
              <Text style={[styles.badgeText, styles[`${product.condition}Text`]]}>
                {t(`CONDITIONS.${product.condition.toUpperCase()}`)}
              </Text>
            </View>
            {product.isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={12} color="#10B981" />
                <Text style={styles.verifiedText}>{t('COMMON.VERIFIED')}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#F8FAFC',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'right',
  },
  details: {
    gap: 8,
  },
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#16A34A',
  },
  negotiable: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#64748B',
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    flex: 1,
    textAlign: 'right',
  },
  badgeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadge: {
    backgroundColor: '#ECFDF5',
  },
  usedBadge: {
    backgroundColor: '#EFF6FF',
  },
  needs_repairBadge: {
    backgroundColor: '#FEF2F2',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
  },
  newText: {
    color: '#10B981',
  },
  usedText: {
    color: '#3B82F6',
  },
  needs_repairText: {
    color: '#EF4444',
  },
  verifiedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
  },
});

export default ProductCard;