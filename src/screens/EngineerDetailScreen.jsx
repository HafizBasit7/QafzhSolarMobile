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
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function EngineerDetailScreen({ route, navigation }) {
  const { engineer } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${engineer.phone}`);
  };

  const handleWhatsApp = () => {
    const message = `مرحباً ${engineer.name}، أنا مهتم بخدماتك في مجال الطاقة الشمسية`;
    Linking.openURL(`whatsapp://send?phone=${engineer.phone}&text=${encodeURIComponent(message)}`);
  };

  return (
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
                  <Text style={styles.verifiedText}>مهندس موثوق</Text>
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
            <Text style={styles.callButtonText}>اتصال</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <Text style={styles.whatsappButtonText}>واتساب</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات المهندس</Text>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="certificate-outline" size={20} color="#16A34A" />
            <Text style={styles.detailText}>الشهادات: {engineer.certifications?.join('، ')}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="work-outline" size={20} color="#16A34A" />
            <Text style={styles.detailText}>الخبرة: {engineer.experience}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#16A34A" />
            <Text style={styles.detailText}>المحافظة: {engineer.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={20} color="#16A34A" />
            <Text style={styles.detailText}>الهاتف: {engineer.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={20} color="#16A34A" />
            <Text style={styles.detailText}>البريد الإلكتروني: {engineer.email}</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
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
          <Text style={styles.sectionTitle}>المشاريع المنفذة</Text>
          <Text style={styles.projectsText}>
            قام المهندس بتنفيذ {engineer.completedProjects} مشروع في مجال الطاقة الشمسية
          </Text>
        </View>

        {/* Request Button */}
        <TouchableOpacity style={styles.requestButton}  onPress={handleCall}>
          <Text style={styles.requestButtonText}>طلب خدمة</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingTop: 10,
    paddingBottom: 20,
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
