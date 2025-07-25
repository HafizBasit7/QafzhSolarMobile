import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const scaleSize = (size) => {
  const scaleFactor = isTablet ? 1.2 : isSmallDevice ? 0.9 : 1;
  return size * scaleFactor;
};

const scaleFont = (size) => {
  const scaleFactor = isTablet ? 1.15 : isSmallDevice ? 0.95 : 1;
  return size * scaleFactor;
};

export default function ShopCard({ shop }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handlePress = () => {
    navigation.navigate('Shop', { shopId: shop._id });
  };

  const handleCall = () => {
    if (shop.phone) {
      Linking.openURL(`tel:${shop.phone}`);
    }
  };

  const getServiceLabel = (service) => {
    switch (service) {
      case 'بيع':
        return t('SERVICES.SELL');
      case 'تركيب':
        return t('SERVICES.INSTALL');
      case 'إصلاح':
        return t('SERVICES.REPAIR');
      case 'صيانة':
        return t('SERVICES.MAINTENANCE');
      case 'استشارات':
        return t('SERVICES.CONSULTING');
      default:
        return service;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
      accessibilityLabel={`${t('ACCESS.SHOP')} ${shop.name} ${t('ACCESS.IN')} ${shop.city}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <Image
          source={{ uri: shop.logoUrl || 'https://via.placeholder.com/60' }}
          style={styles.shopLogo}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.shopInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.shopName} numberOfLines={1} ellipsizeMode="tail">
              {shop.name}
            </Text>
            {shop.isVerified && (
              <View style={styles.verificationBadge} accessibilityLabel={t('COMMON.VERIFIED')}>
                <Ionicons name="checkmark-circle" size={scaleSize(14)} color="#10B981" />
                <Text style={styles.verifiedText}>{t('COMMON.VERIFIED')}</Text>
              </View>
            )}
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={scaleSize(14)} color="#64748B" />
            <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
              {shop.city}, {shop.governorate}
            </Text>
          </View>
        </View>
      </View>

      {shop.services?.length > 0 && (
        <View style={styles.servicesContainer}>
          {shop.services.map((service, index) => (
            <View key={`${service}-${index}`} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{getServiceLabel(service)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
          accessibilityLabel={`${t('COMMON.CALL')} ${shop.phone}`}
          accessibilityRole="button"
        >
          <Ionicons name="call-outline" size={scaleSize(16)} color="#FFFFFF" />
          <Text style={styles.callButtonText}>{t('COMMON.CALL')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scaleSize(12),
    padding: scaleSize(16),
    marginBottom: scaleSize(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    width: isTablet ? '48%' : '100%', // Two columns on tablet
    alignSelf: isTablet ? 'flex-start' : 'auto',
    marginHorizontal: isTablet ? scaleSize(4) : 0,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: scaleSize(12),
  },
  shopLogo: {
    width: scaleSize(60),
    height: scaleSize(60),
    borderRadius: scaleSize(8),
    marginLeft: scaleSize(12),
  },
  shopInfo: {
    flex: 1,
    marginRight: scaleSize(4),
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: scaleSize(6),
    flexWrap: 'wrap',
  },
  shopName: {
    fontSize: scaleFont(16),
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    flexShrink: 1,
  },
  verificationBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: scaleSize(6),
    paddingVertical: scaleSize(2),
    borderRadius: scaleSize(4),
    marginRight: scaleSize(8),
  },
  verifiedText: {
    fontSize: scaleFont(12),
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: scaleSize(4),
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  location: {
    fontSize: scaleFont(13),
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginRight: scaleSize(4),
    maxWidth: '90%',
  },
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: scaleSize(12),
    gap: scaleSize(8),
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: scaleSize(4),
    paddingHorizontal: scaleSize(10),
    borderRadius: scaleSize(4),
  },
  serviceText: {
    fontSize: scaleFont(12),
    fontFamily: 'Tajawal-Medium',
    color: '#16A34A',
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: scaleSize(12),
    marginTop: scaleSize(4),
  },
  callButton: {
    backgroundColor: '#16A34A',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(16),
    borderRadius: scaleSize(6),
    minWidth: scaleSize(100),
    justifyContent: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(14),
    marginRight: scaleSize(6),
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: scaleFont(12),
    fontFamily: 'Tajawal-Medium',
    color: '#64748B',
    marginRight: scaleSize(4),
  },
});