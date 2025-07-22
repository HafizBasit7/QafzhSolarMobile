import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ProductDetailScreen() {
  const route = useRoute();
  const { product } = route.params;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const { t } = useTranslation();

  const handleCallSeller = () => {
    Linking.openURL(`tel:${product.phone}`);
  };

  const currencySymbol = product.currency === 'YER' ? '﷼' : '$';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Gallery */}
          <View style={styles.imageWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            >
              {(Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image]).map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img || 'https://via.placeholder.com/400' }}
                  style={[styles.productImage, { width }]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            <View style={styles.imageIndicator}>
              {(Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image]).map((_, index) => (
                <View key={index} style={styles.indicatorDot} />
              ))}
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, isSmallScreen && styles.smallTitle]} numberOfLines={2}>
                {product.title}
              </Text>
              {product.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  <Text style={styles.verifiedText}>{t('PRODUCT.verified')}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.price, isSmallScreen && styles.smallPrice]}>
              {product.price} {currencySymbol}
            </Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <MaterialIcons name="category" size={18} color="#64748B" />
                <Text style={styles.detailLabel}>{t('PRODUCT.type')}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{product.type}</Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialIcons name="build" size={18} color="#64748B" />
                <Text style={styles.detailLabel}>{t('PRODUCT.condition')}</Text>
                <Text style={[
                  styles.detailValue,
                  product.condition === 'new' && { color: '#10B981' },
                  product.condition === 'used' && { color: '#F59E0B' }
                ]}>
                  {product.condition === 'new' ? t('PRODUCT.new') : t('PRODUCT.used')}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <Text style={styles.detailLabel}>{t('PRODUCT.location')}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {product.city}, {product.governorate}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialIcons name="verified-user" size={18} color="#64748B" />
                <Text style={styles.detailLabel}>{t('PRODUCT.warranty')}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {product.warranty || t('PRODUCT.notAvailable')}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isSmallScreen && styles.smallSectionTitle]}>
                {t('PRODUCT.details')}
              </Text>
              <Text style={styles.description}>
                {product.description || t('PRODUCT.noDescription')}
              </Text>
            </View>

            <View style={styles.sellerSection}>
              <Text style={[styles.sectionTitle, isSmallScreen && styles.smallSectionTitle]}>
                {t('PRODUCT.sellerInfo')}
              </Text>
              <View style={styles.sellerInfo}>
                <View style={styles.sellerText}>
                  <Text style={styles.sellerName} numberOfLines={1}>
                    {product.sellerName || t('PRODUCT.unknown')}
                  </Text>
                  <Text style={styles.sellerLocation} numberOfLines={1}>
                    <Ionicons name="location-outline" size={12} />
                    {' '}{product.city}, {product.governorate}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={22} color="#16A34A" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.primaryButton, isSmallScreen && styles.smallPrimaryButton]} 
            onPress={handleCallSeller}
          >
            <Ionicons name="call-outline" size={18} color="#FFFFFF" />
            <Text style={[styles.primaryButtonText, isSmallScreen && styles.smallPrimaryButtonText]}>
              {t('PRODUCT.callSeller')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    // paddingTop: 10,
  },
  scrollContainer: {
    paddingBottom: 100, // Space for action bar
  },
  imageWrapper: {
    height: 300,
    position: 'relative',
  },
  imageGallery: {
    height: 300,
  },
  productImage: {
    height: 300,
  },
  imageIndicator: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 20,
    marginTop: -20,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    textAlign: 'right',
    flex: 1,
  },
  smallTitle: {
    fontSize: 18,
  },
  verifiedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: 4,
  },
  price: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    color: '#16A34A',
    textAlign: 'right',
    marginBottom: 16,
  },
  smallPrice: {
    fontSize: 20,
  },
  detailsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginTop: 6,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'right',
  },
  smallSectionTitle: {
    fontSize: 15,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#475569',
    lineHeight: 22,
    textAlign: 'right',
  },
  sellerSection: {
    marginBottom: 20,
  },
  sellerInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
  },
  sellerText: {
    flex: 1,
  },
  sellerName: {
    fontSize: 15,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    textAlign: 'right',
  },
  sellerLocation: {
    fontSize: 13,
    fontFamily: 'Tajawal-Regular',
    color: '#16A34A',
    textAlign: 'right',
    marginTop: 4,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  saveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginLeft: 10,
  },
  smallPrimaryButton: {
    padding: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 15,
    marginRight: 6,
  },
  smallPrimaryButtonText: {
    fontSize: 14,
  }
});