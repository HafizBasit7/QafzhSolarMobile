import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useEngineers } from '../hooks/useEngineers';
import LoadingSpinner from '../components/common/LoadingSpinner';
// import AuthGuard from '../components/common/AuthGuard';

const { width } = Dimensions.get('window');

const EngineerDetailScreen = ({ navigation, route }) => {
  const { engineerId } = route.params;
  const { t } = useTranslation();
  const { useEngineer } = useEngineers();
  const { data: engineer, isLoading, isError, error } = useEngineer(engineerId);

  const handleCall = () => Linking.openURL(`tel:${engineer.phone}`);
  const handleWhatsApp = () => {
    const message = t('ENGINEER.whatsappMessage', { name: engineer.name });
    Linking.openURL(`whatsapp://send?phone=${engineer.phone}&text=${encodeURIComponent(message)}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || 'Failed to load engineer details'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!engineer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Engineer not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Content = () => (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: engineer.image ?? '' }} 
            style={styles.engineerImage}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{engineer.name}</Text>
              {engineer.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="#10B981" />
                  <Text style={styles.verifiedText}>{t('ENGINEER.verified')}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack?.()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.specialization}>{engineer.specialization}</Text>
          </View>
        </View>

        {/* Contact Buttons */}
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            <Text style={styles.callButtonText}>{t('ENGINEER.call')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <Text style={styles.whatsappButtonText}>{t('ENGINEER.whatsapp')}</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.info')}</Text>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="certificate-outline" size={20} color="#16A34A" />
            <Text style={styles.detailText}>{t('ENGINEER.certifications')}: {engineer.certifications?.join('، ')}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="work-outline" size={20} color="#16A34A" />
            <Text style={styles.detailText}>{t('ENGINEER.experience')}: {engineer.experience}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#16A34A" />
            <Text style={styles.detailText}>{t('ENGINEER.location')}: {engineer.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={20} color="#16A34A" />
            <Text style={styles.detailText}>{t('ENGINEER.phone')}: {engineer.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={20} color="#16A34A" />
            <Text style={styles.detailText}>{t('ENGINEER.email')}: {engineer.email}</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.services')}</Text>
          <View style={styles.servicesContainer}>
            {engineer.services?.map((service, index) => (
              <View key={index} style={styles.serviceBadge}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.projects')}</Text>
          <Text style={styles.projectsText}>
            {t('ENGINEER.completedProjects', { count: engineer.completedProjects })}
          </Text>
        </View>

        {/* Request Button */}
        <TouchableOpacity style={styles.requestButton} onPress={handleCall}>
          <Text style={styles.requestButtonText}>{t('ENGINEER.requestService')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    // <AuthGuard returnData={{ engineerId }}>
    //   <Content />
    // </AuthGuard>
    <Content />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Medium',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  engineerImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    marginLeft: 16,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
  },
  verifiedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 5,
    left: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 2,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: 4,
  },
  specialization: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#16A34A',
    marginBottom: 8,
  },
  contactButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  callButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: width * 0.42,
    justifyContent: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    marginRight: 8,
  },
  whatsappButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: width * 0.42,
    justifyContent: 'center',
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    marginRight: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Regular',
    color: '#334155',
    marginRight: 8,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
  },
  servicesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  serviceBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  serviceText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#16A34A',
  },
  projectsText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Regular',
    color: '#334155',
    lineHeight: 24,
    textAlign: 'right',
  },
  requestButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 18,
  },
});

export default EngineerDetailScreen;
