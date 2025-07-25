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
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useEngineers } from '../hooks/useEngineers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { width } = Dimensions.get('window');

const EngineerDetailScreen = ({ navigation, route }) => {
  const { engineerId } = route.params;
  const { t } = useTranslation();
  const { useEngineer } = useEngineers();
  const { data: engineerResponse, isLoading, isError, error } = useEngineer(engineerId)

  const engineer = engineerResponse?.data || engineerResponse || {};

  const handleCall = () => Linking.openURL(`tel:${engineer?.phone}`);
  const handleWhatsApp = () => Linking.openURL(`https://wa.me/${engineer?.whatsappPhone}`);
  const handleEmail = () => Linking.openURL(`mailto:${engineer?.email}`);

  const formatWorkingDays = (days) => {
    if (!days) return t('ENGINEER.notAvailable');
    return days.join(', ');
  };

  const renderCertification = ({ item }) => (
    <View style={styles.certificationItem}>
      <Text style={styles.certificationName}>{item.name}</Text>
      <Text style={styles.certificationDetail}>{item.issuedBy}</Text>
      <Text style={styles.certificationDetail}>
        {t('ENGINEER.issued')}: {new Date(item.issuedDate).toLocaleDateString()}
      </Text>
      {item.expiryDate && (
        <Text style={styles.certificationDetail}>
          {t('ENGINEER.expires')}: {new Date(item.expiryDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  const renderPortfolioImage = ({ item }) => (
    <Image 
      source={{ uri: item }} 
      style={styles.portfolioImage}
      resizeMode="cover"
    />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || t('ENGINEER.loadError')}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>{t('COMMON.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!engineer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('ENGINEER.notFound')}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>{t('COMMON.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={{ uri: engineer.profileImageUrl || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{engineer.name}</Text>
              {engineer.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="#10B981" />
                  <Text style={styles.verifiedText}>{t('ENGINEER.verified')}</Text>
                </View>
              )}
              {engineer.isFeatured && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.featuredText}>{t('ENGINEER.featured')}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.specialization}>
              {engineer.specializations?.join(', ')}
            </Text>
            
            {/* <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {engineer.rating?.average?.toFixed(1) || t('ENGINEER.noRating')}
                <Text style={styles.ratingCount}> ({engineer.rating?.count || 0})</Text>
              </Text>
            </View> */}
          </View>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Contact Buttons */}
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>{t('ENGINEER.call')}</Text>
          </TouchableOpacity>
          
          {engineer.whatsappPhone && (
            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>{t('ENGINEER.whatsapp')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.info')}</Text>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#16A34A" />
            <View style={styles.detailTextContainer}>
              {/* <Text style={styles.detailLabel}>{t('ENGINEER.location')}</Text> */}
              <Text style={styles.detailText}>
                {engineer.address}, {engineer.city}, {engineer.governorate}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={20} color="#16A34A" />
            <View style={styles.detailTextContainer}>
              {/* <Text style={styles.detailLabel}>{t('ENGINEER.phone')}</Text> */}
              <Text style={styles.detailText}>{engineer.phone}</Text>
            </View>
          </View>

          {engineer.whatsappPhone && (
            <View style={styles.detailRow}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <View style={styles.detailTextContainer}>
                {/* <Text style={styles.detailLabel}>{t('ENGINEER.whatsapp')}</Text> */}
                <Text style={styles.detailText}>{engineer.whatsappPhone}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={20} color="#16A34A" />
            <View style={styles.detailTextContainer}>
              {/* <Text style={styles.detailLabel}>{t('ENGINEER.email')}</Text> */}
              <Text style={styles.detailText}>{engineer.email}</Text>
            </View>
          </View>

          {engineer.notes && (
            <View style={styles.detailRow}>
              <MaterialIcons name="notes" size={20} color="#16A34A" />
              <View style={styles.detailTextContainer}>
                {/* <Text style={styles.detailLabel}>{t('ENGINEER.notes')}</Text> */}
                <Text style={styles.detailText}>{engineer.notes}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Experience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.experience')}</Text>
          
          <View style={styles.experienceContainer}>
            <Text style={styles.experienceYears}>
              {engineer.experience?.years} {t('ENGINEER.experience')}
            </Text>
            <Text style={styles.experienceDescription}>
              {engineer.experience?.description}
            </Text>
          </View>
        </View>

        {/* Services Section */}
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

        {/* Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.availability')}</Text>
          
          <View style={styles.availabilityRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#16A34A" />
            <Text style={styles.availabilityText}>
              {engineer.availability?.workingHours?.start} - {engineer.availability?.workingHours?.end}
            </Text>
          </View>
          
          <View style={styles.availabilityRow}>
            <MaterialCommunityIcons name="calendar-blank" size={20} color="#16A34A" />
            <Text style={styles.availabilityText}>
              {formatWorkingDays(engineer.availability?.workingDays)}
            </Text>
          </View>
          
          <View style={styles.availabilityRow}>
            <MaterialCommunityIcons name="account-check" size={20} color="#16A34A" />
            <Text style={[
              styles.availabilityStatus,
              engineer.availability?.status === 'Available' && styles.availableStatus
            ]}>
              {engineer.availability?.status}
            </Text>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ENGINEER.pricing')}</Text>
          
          <View style={styles.pricingRow}>
            <MaterialCommunityIcons name="cash" size={20} color="#16A34A" />
            <Text style={styles.pricingText}>
              {t('ENGINEER.hourlyRate')}: {engineer.pricing?.hourlyRate} {engineer.pricing?.currency}
            </Text>
          </View>
          
          <View style={styles.pricingRow}>
            <MaterialCommunityIcons name="cash-multiple" size={20} color="#16A34A" />
            <Text style={styles.pricingText}>
              {t('ENGINEER.minimumCharge')}: {engineer.pricing?.minimumCharge} {engineer.pricing?.currency}
            </Text>
          </View>
        </View>

        {/* Certifications Section */}
        {engineer.certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('ENGINEER.certifications')}</Text>
            <FlatList
              data={engineer.certifications}
              renderItem={renderCertification}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Portfolio Section */}
        {engineer.portfolioImages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('ENGINEER.portfolio')}</Text>
            <FlatList
              data={engineer.portfolioImages}
              renderItem={renderPortfolioImage}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.portfolioContainer}
            />
          </View>
        )}

        {/* Contact Action */}
        <TouchableOpacity 
          style={styles.contactAction} 
          onPress={handleCall}
        >
          <Text style={styles.contactActionText}>{t('ENGINEER.requestService')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#16A34A',
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  featuredBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  featuredText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#D97706',
    marginRight: 4,
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginRight: 4,
  },
  ratingCount: {
    color: '#64748B',
    fontFamily: 'Tajawal-Regular',
  },
  detailTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
    color: '#64748B',
    marginBottom: 2,
  },
  experienceContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  experienceYears: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#475569',
    lineHeight: 20,
  },
  availabilityRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 6,
  },
  availabilityText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Regular',
    color: '#334155',
    marginRight: 8,
    flex: 1,
  },
  availabilityStatus: {
    fontSize: 15,
    fontFamily: 'Tajawal-Medium',
    marginRight: 8,
    flex: 1,
  },
  availableStatus: {
    color: '#10B981',
  },
  pricingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 6,
  },
  pricingText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginRight: 8,
    flex: 1,
  },
  certificationItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  certificationName: {
    fontSize: 15,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  certificationDetail: {
    fontSize: 13,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  portfolioContainer: {
    paddingVertical: 8,
  },
  portfolioImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginLeft: 8,
  },
  contactAction: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
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
  contactActionText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 18,
  },
});

export default EngineerDetailScreen;
