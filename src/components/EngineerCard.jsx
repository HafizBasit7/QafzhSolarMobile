import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';


export default function EngineerCard({ engineer }) {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('EngineerDetail', { engineer });
  };

  const handleCall = () => {
    // Implement calling functionality
    // Example: Linking.openURL(`tel:${engineer.phone}`)
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Engineer Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: engineer.profileImageUrl || 'https://via.placeholder.com/60' }} 
          style={styles.engineerImage}
        />
        <View style={styles.engineerInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.engineerName}>{engineer.name}</Text>
            {engineer.isVerified && (
              <View style={styles.verificationBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.verifiedText}>{t('COMMON.VERIFIED')}</Text>

              </View>
            )}
          </View>
          <View style={styles.specializationContainer}>
            <MaterialIcons name="engineering" size={14} color="#64748B" />
            <Text style={styles.specialization}>
              {Array.isArray(engineer.specializations) ? engineer.specializations.join(', ') : ''}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={styles.location}>
              {engineer.city}, {engineer.governorate}
            </Text>
          </View>
        </View>
      </View>

      {/* Services */}
      <View style={styles.servicesContainer}>
            {engineer.services.slice(0, 3).map((service, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{service}</Text>
              </View>
            ))}
            {engineer.services.length > 3 && (
              <View style={[styles.badge, styles.moreBadge]}>
                <Text style={[styles.badgeText, styles.moreText]}>
                  +{engineer.services.length - 3}
                </Text>
              </View>
            )}
          </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCall}
        >
          <Ionicons name="call-outline" size={16} color="#FFFFFF" />
          <Text style={styles.callButtonText}>{t('COMMON.CALL')}</Text>

        </TouchableOpacity>
        
       
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
  engineerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  engineerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
  },
  engineerName: {
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
  specializationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
  },
  specialization: {
    fontSize: 13,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
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
  moreServicesTag: {
    backgroundColor: '#F0FDF4',
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
  moreServicesText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#065F46',
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
    backgroundColor: '#16A34A',
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
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#065F46',
    fontFamily: 'Tajawal-Medium',
  },
  moreBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  moreText: {
    color: '#1D4ED8',
  },
});