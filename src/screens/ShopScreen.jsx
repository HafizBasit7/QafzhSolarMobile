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

  const handleCall = () => Linking.openURL(`tel:${shop.phone}`);
  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${shop.city},${shop.governorate}`;
    Linking.openURL(url);
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

  const Content = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Image */}
        <View style={[styles.headerContainer, { height: width * 0.75 }]}>
          <ImageBackground
            source={{ uri: shop.image || 'https://via.placeholder.com/400x200' }}
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

            {/* Location */}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={18} color="#10B981" />
              <Text style={styles.locationText}>
                {shop.city}, {shop.governorate}
              </Text>
            </View>

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

            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('SHOP.contactShop')}</Text>
              <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
                <Ionicons name="call-outline" size={20} color="#10B981" />
                <Text style={styles.contactText}>{shop.phone}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => Linking.openURL(`whatsapp://send?phone=${shop.phone}`)}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.contactText}>{t('SHOP.chatOnWhatsapp')}</Text>
              </TouchableOpacity>
            </View>
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
});

export default ShopScreen;
