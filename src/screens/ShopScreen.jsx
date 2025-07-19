import { View, Text, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ar from '../locales/ar';

export default function ShopScreen() {
  const route = useRoute();
  const { shop } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${shop.phone}`);
  };

  const handleDirections = () => {
    // Implement map directions
  };

  return (
    <ScrollView style={styles.container}>
      {/* Shop Header */}
      <View style={styles.header}>
        <Text style={styles.shopName}>{shop.name}</Text>
        <Text style={styles.location}>
          {shop.city}, {shop.governorate}
        </Text>
      </View>

      {/* Shop Image */}
      {shop.image && (
        <Image source={{ uri: shop.image }} style={styles.shopImage} />
      )}

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات الاتصال</Text>
        <TouchableOpacity onPress={handleCall}>
          <Text style={styles.phone}>{shop.phone}</Text>
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
        <View style={styles.servicesContainer}>
          {shop.services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>
                {service === 'sale' && ar.SHOPS.SALE}
                {service === 'installation' && ar.SHOPS.INSTALLATION}
                {service === 'repair' && ar.SHOPS.REPAIR}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>اتصال</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
          <Text style={styles.directionsButtonText}>الاتجاهات</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  shopName: {
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
  },
  location: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    fontFamily: 'Tajawal-Regular',
  },
  shopImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  phone: {
    fontSize: 16,
    color: '#1E3A8A',
    textAlign: 'right',
    fontFamily: 'Tajawal-Regular',
    textDecorationLine: 'underline',
  },
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
    marginBottom: 8,
  },
  serviceText: {
    color: '#1E3A8A',
    fontFamily: 'Tajawal-Regular',
  },
  actions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  callButton: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  callButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Tajawal-Bold',
  },
  directionsButton: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  directionsButtonText: {
    color: '#1E3A8A',
    textAlign: 'center',
    fontFamily: 'Tajawal-Bold',
  },
};