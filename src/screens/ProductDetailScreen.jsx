import { Dimensions ,View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import ar from '../locales/ar';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductDetailScreen() {
  const route = useRoute();
  const { product } = route.params;

  const handleCallSeller = () => {
    Linking.openURL(`tel:${product.phone}`);
  };

  const currencySymbol = product.currency === 'YER' ? '﷼' : '$';

  return (
    <View style={styles.container}>
      {/* Image Gallery with Indicator */}
      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageGallery}
      >
        {product.images.map((img, index) => (
          <Image 
            key={index}
            source={{ uri: img || 'https://via.placeholder.com/400' }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Image Indicator */}
      <View style={styles.imageIndicator}>
        {product.images.map((_, index) => (
          <View key={index} style={styles.indicatorDot} />
        ))}
      </View>

      {/* Product Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{product.title}</Text>
          {product.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.verifiedText}>موثوق</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>
          {product.price} {currencySymbol}
        </Text>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <MaterialIcons name="category" size={20} color="#64748B" />
            <Text style={styles.detailLabel}>النوع</Text>
            <Text style={styles.detailValue}>{product.type}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="build" size={20} color="#64748B" />
            <Text style={styles.detailLabel}>الحالة</Text>
            <Text style={[
              styles.detailValue,
              product.condition === 'new' && { color: '#10B981' },
              product.condition === 'used' && { color: '#F59E0B' }
            ]}>
              {product.condition === 'new' ? 'جديد' : 'مستعمل'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#64748B" />
            <Text style={styles.detailLabel}>الموقع</Text>
            <Text style={styles.detailValue}>
              {product.city}, {product.governorate}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="verified-user" size={20} color="#64748B" />
            <Text style={styles.detailLabel}>الضمان</Text>
            <Text style={styles.detailValue}>
              {product.warranty || 'غير متوفر'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل المنتج</Text>
          <Text style={styles.description}>
            {product.description || 'لا يوجد وصف متوفر'}
          </Text>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerSection}>
          <Text style={styles.sectionTitle}>معلومات البائع</Text>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerText}>
              <Text style={styles.sellerName}>{product.sellerName || 'غير معروف'}</Text>
              <Text style={styles.sellerLocation}>
                <Ionicons name="location-outline" size={14} />
                {' '}{product.city}, {product.governorate}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>4.8 (24)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Fixed Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => {/* Implement save functionality */}}
        >
          <Ionicons name="bookmark-outline" size={24} color="#3B82F6" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleCallSeller}
        >
          <Ionicons name="call-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>اتصال بالبائع</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  imageGallery: {
    height: 300,
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  imageIndicator: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    position: 'absolute',
    top: 280,
    left: 0,
    right: 0,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    textAlign: 'right',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  verifiedText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: 4,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    color: '#1E40AF',
    textAlign: 'right',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'right',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Tajawal-Regular',
    color: '#475569',
    lineHeight: 24,
    textAlign: 'right',
  },
  sellerSection: {
    marginBottom: 24,
  },
  sellerInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  sellerText: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    textAlign: 'right',
  },
  sellerLocation: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    textAlign: 'right',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginRight: 4,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginLeft: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    marginRight: 8,
  },
  callButton: {
    backgroundColor: '#10B981', // Green for high visibility
    flexDirection: 'row-reverse',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  callButtonText: {
    color: 'white',
    fontFamily: 'Tajawal-Bold',
    fontSize: 18,
    marginRight: 10
  },
  warningText: {
    color: '#EF4444',
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    marginTop: 10
  }
});