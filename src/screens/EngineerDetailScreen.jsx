import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ar from '../locales/ar';

export default function EngineerDetailScreen() {
  const route = useRoute();
  const { engineer } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${engineer.phone}`);
  };

  const handleRequest = () => {
    // Navigation to request form would go here
    alert('طلب خدمة من المهندس');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{engineer.name}</Text>
        <Text style={styles.governorate}>{engineer.governorate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
        <View style={styles.servicesContainer}>
          {engineer.services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات الاتصال</Text>
        <Text style={styles.phone}>{engineer.phone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.buttonText}>اتصال</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
          <Text style={styles.buttonText}>طلب خدمة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    color: '#1E3A8A',
  },
  governorate: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
    marginBottom: 12,
    color: '#1E3A8A',
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
  phone: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    textAlign: 'right',
    color: '#1E3A8A',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  callButton: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  requestButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Tajawal-Bold',
  },
};