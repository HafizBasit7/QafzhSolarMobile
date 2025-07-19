import { View, Text, Image, ScrollView, Linking, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ar from '../locales/ar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function ShopScreen() {
  const route = useRoute();
  const { shop } = route.params;

  const handleCall = () => Linking.openURL(`tel:${shop.phone}`);
  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${shop.city},${shop.governorate}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <ImageBackground
          source={{ uri: shop.image || 'https://via.placeholder.com/400x200' }}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.gradient}
          />
        </ImageBackground>
      </View>

      <ScrollView style={styles.content}>
        {/* Shop Info Section */}
        <View style={styles.shopInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.shopName}>{shop.name}</Text>
            {shop.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.verifiedText}>متجر موثوق</Text>
              </View>
            )}
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#3B82F6" />
            <Text style={styles.locationText}>
              {shop.city}, {shop.governorate}
            </Text>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
            <View style={styles.servicesContainer}>
              {shop.services?.map((service, index) => (
                <View key={index} style={styles.serviceTag}>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اتصل بالمتجر</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Ionicons name="call-outline" size={24} color="#3B82F6" />
              <Text style={styles.contactText}>{shop.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleDirections}>
          <Ionicons name="navigate-outline" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>الاتجاهات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCall}>
          <Ionicons name="call-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>اتصال</Text>
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
  header: {
    height: 220,
  },
  headerImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '50%',
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -40,
  },
  shopInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
  },
  verifiedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  verifiedText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: 4,
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginRight: 8,
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
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginRight: -8,
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#1E40AF',
  },
  contactItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginRight: 12,
  },
  actionBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    marginRight: 8,
  },
});