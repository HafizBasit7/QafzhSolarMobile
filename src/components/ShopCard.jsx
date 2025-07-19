import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Properly imported
import ar from '../locales/ar';

export default function ShopCard({ shop }) {
  const navigation = useNavigation(); // Correctly used

  const handlePress = () => {
    navigation.navigate('Shop', { shop });
  };

  const handleCall = () => {
    // Implement calling functionality
    // Example: Linking.openURL(`tel:${shop.phone}`)
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Shop Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: shop.image || 'https://via.placeholder.com/60' }} 
          style={styles.shopLogo}
        />
        <View style={styles.shopInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.shopName}>{shop.name}</Text>
            {shop.isVerified && (
              <View style={styles.verificationBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.verifiedText}>موثوق</Text>
              </View>
            )}
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={styles.location}>
              {shop.city}, {shop.governorate}
            </Text>
          </View>
        </View>
      </View>

      {/* Services */}
      <View style={styles.servicesContainer}>
        {shop.services?.map((service, index) => (
          <View key={index} style={styles.serviceTag}>
            <Text style={styles.serviceText}>
              {service === 'بيع' && 'بيع'}
              {service === 'تركيب' && 'تركيب'}
              {service === 'إصلاح' && 'إصلاح'}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCall}
        >
          <Ionicons name="call-outline" size={16} color="#FFFFFF" />
          <Text style={styles.callButtonText}>{ar.COMMON.CALL}</Text>
        </TouchableOpacity>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>4.8 (24)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  shopInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
  },
  shopName: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
  },
  verificationBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: 4,
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginRight: 4,
  },
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#1E40AF',
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 4,
  },
  callButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Medium',
    fontSize: 14,
    marginRight: 6,
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#64748B',
    marginRight: 4,
  },
});