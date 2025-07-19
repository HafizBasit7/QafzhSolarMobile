import { View, Text, StyleSheet } from 'react-native';
import ar from '../locales/ar';

export default function EngineerCard({ engineer }) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.name}>{engineer.name}</Text>
        <Text style={styles.governorate}>{engineer.governorate}</Text>
        
        <View style={styles.servicesContainer}>
          {engineer.services.map((service, index) => (
            <Text key={index} style={styles.service}>
              {service}{index < engineer.services.length - 1 ? ' • ' : ''}
            </Text>
          ))}
        </View>
        
        <Text style={styles.phone}>{ar.COMMON.PHONE}: {engineer.phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  governorate: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  service: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#3B82F6',
  },
  phone: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#1E3A8A',
    marginTop: 4,
  },
});