import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  useWindowDimensions,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { useShops } from '../hooks/useShops';
import LoadingSpinner from '../components/common/LoadingSpinner';
// import AuthGuard from '../components/common/AuthGuard';

const ShopScreen = ({ navigation }) => {
  const route = useRoute();
  const { shopId } = route.params;
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { useShop } = useShops();
  const { data: shop, isLoading, isError, error } = useShop(shopId);

  const handleCall = () => Linking.openURL(`tel:${shop?.phone}`);
  const handleDirections = () => {
    if (shop?.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${shop.location.latitude},${shop.location.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleSocialMedia = (url) => {
    if (url) Linking.openURL(url);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || 'Failed to load shop details'}
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

  if (!shop) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Shop not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderWorkingHours = () => {
    if (!shop.workingHours) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.workingHours')}</Text>
        <View style={styles.workingHoursContainer}>
          <Text style={styles.workingHoursText}>
            {shop.workingHours.openTime} - {shop.workingHours.closeTime}
          </Text>
          {shop.workingHours.workingDays?.length > 0 && (
            <View style={styles.workingDaysContainer}>
              {shop.workingHours.workingDays.map((day, index) => (
                <View key={index} style={styles.workingDayBadge}>
                  <Text style={styles.workingDayText}>{day}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderRating = () => {
    if (!shop.rating) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.rating')}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {shop.rating.average.toFixed(1)} ({shop.rating.count} {t('SHOP.reviews')})
          </Text>
        </View>
      </View>
    );
  };

  const renderSocialMedia = () => {
    if (!shop.socialMedia) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.socialMedia')}</Text>
        <View style={styles.socialMediaContainer}>
          {shop.socialMedia.facebook && (
            <TouchableOpacity 
              style={styles.socialMediaButton} 
              onPress={() => handleSocialMedia(shop.socialMedia.facebook)}
            >
              <Ionicons name="logo-facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
          )}
          {shop.socialMedia.instagram && (
            <TouchableOpacity 
              style={styles.socialMediaButton} 
              onPress={() => handleSocialMedia(shop.socialMedia.instagram)}
            >
              <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            </TouchableOpacity>
          )}
          {shop.socialMedia.twitter && (
            <TouchableOpacity 
              style={styles.socialMediaButton} 
              onPress={() => handleSocialMedia(shop.socialMedia.twitter)}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderImages = () => {
    if (!shop.images || shop.images.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.gallery')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shop.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderBrands = () => {
    if (!shop.brands || shop.brands.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.brands')}</Text>
        <View style={styles.brandsContainer}>
          {shop.brands.map((brand, index) => (
            <View key={index} style={styles.brandBadge}>
              <Text style={styles.brandText}>{brand}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderProductCategories = () => {
    if (!shop.productCategories || shop.productCategories.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.productCategories')}</Text>
        <View style={styles.categoriesContainer}>
          {shop.productCategories.map((category, index) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('SHOP.additionalInfo')}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('SHOP.establishedYear')}:</Text>
          <Text style={styles.infoValue}>{shop.establishedYear}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('SHOP.licenseNumber')}:</Text>
          <Text style={styles.infoValue}>{shop.licenseNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('SHOP.website')}:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(shop.website)}>
            <Text style={[styles.infoValue, styles.linkText]}>{shop.website}</Text>
          </TouchableOpacity>
        </View>
        {shop.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('SHOP.notes')}:</Text>
            <Text style={styles.infoValue}>{shop.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  const Content = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Image */}
        <View style={[styles.headerContainer, { height: width * 0.75 }]}>
          <ImageBackground
            source={{ uri: shop.logoUrl || shop.images?.[0] || 'https://via.placeholder.com/400x200' }}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent']}
              style={styles.gradient}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack?.()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
          <View style={styles.card}>
            {/* Shop Info */}
            <View style={styles.nameRow}>
          
              <Text style={styles.shopName}>{shop.name}</Text>
              {shop.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.verifiedText}>{t('SHOP.verifiedShop')}</Text>
                </View>
              )}
            </View>

            {/* Description */}
            {shop.description && (
              <Text style={styles.descriptionText}>{shop.description}</Text>
            )}

            {/* Location */}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={18} color="#10B981" />
              <Text style={styles.locationText}>
                {shop.address}, {shop.city}, {shop.governorate}
              </Text>
            </View>

            {/* {renderRating()} */}
            {renderWorkingHours()}

            {/* Services */}
            {shop.services?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('SHOP.servicesProvided')}</Text>
                <View style={styles.servicesGrid}>
                  {shop.services.map((service, index) => (
                    <View key={index} style={styles.serviceBadge}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {renderProductCategories()}
            {renderBrands()}

            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('SHOP.contactShop')}</Text>
              <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
                <Ionicons name="call-outline" size={20} color="#10B981" />
                <Text style={styles.contactText}>{shop.phone}</Text>
              </TouchableOpacity>
              {shop.whatsappPhone && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => Linking.openURL(`whatsapp://send?phone=${shop.whatsappPhone}`)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  <Text style={styles.contactText}>{t('SHOP.chatOnWhatsapp')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => Linking.openURL(`mailto:${shop.email}`)}
              >
                <Ionicons name="mail-outline" size={20} color="#10B981" />
                <Text style={styles.contactText}>{shop.email}</Text>
              </TouchableOpacity>
            </View>

            {renderSocialMedia()}
            {renderImages()}
            {renderAdditionalInfo()}
          </View>
        </ScrollView>

        {/* Fixed Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleDirections}>
            <Ionicons name="navigate-outline" size={20} color="#10B981" />
            <Text style={styles.secondaryButtonText}>{t('SHOP.directions')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>{t('SHOP.call')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    // <AuthGuard returnData={{ shopId }}>
    //   <Content />
    // </AuthGuard>
    <Content />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerContainer: {
    width: '100%',
  },
  headerImage: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },
  shopName: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'right',
    lineHeight: 22,
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
  verifiedText: {
    fontSize: 13,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
    marginRight: 4,
  },
  locationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Regular',
    color: '#64748B',
    marginRight: 6,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'right',
  },
  servicesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  serviceBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#10B981',
  },
  contactRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 14,
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
    marginBottom: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
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
        elevation: 8,
      },
    }),
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 18,
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
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  secondaryButtonText: {
    color: '#10B981',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    marginRight: 8,
  },
  workingHoursContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  workingHoursText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'right',
  },
  workingDaysContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  workingDayBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 8,
  },
  workingDayText: {
    fontSize: 13,
    fontFamily: 'Tajawal-Medium',
    color: '#3B82F6',
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 15,
    fontFamily: 'Tajawal-Medium',
    color: '#92400E',
    marginRight: 8,
  },
  socialMediaContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  socialMediaButton: {
    marginLeft: 16,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginLeft: 12,
  },
  brandsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  brandBadge: {
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    marginBottom: 8,
  },
  brandText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#7E22CE',
  },
  categoriesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#059669',
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: 'Tajawal-Medium',
    color: '#64748B',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Tajawal-Medium',
    color: '#1E293B',
    textAlign: 'left',
    flex: 1,
    marginLeft: 8,
  },
  linkText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});

export default ShopScreen;