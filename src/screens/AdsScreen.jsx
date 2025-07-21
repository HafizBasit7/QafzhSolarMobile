import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  Text, 
  TouchableOpacity, 
  useWindowDimensions,
  Platform,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Mock offers data
const mockOffers = [
  {
    id: '1',
    title: 'خصم 25% على الألواح الشمسية',
    description: 'عرض خاص لفترة محدودة على ألواح جينكو 450 واط',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expiry: 'ينتهي في 15 ديسمبر',
    discount: '25%',
    isHot: true,
    category: 'الطاقة الشمسية'
  },
  {
    id: '2',
    title: 'تركيب مجاني مع شراء النظام الكامل',
    description: 'احصل على تركيب مجاني عند شراء نظام 5 كيلو واط أو أكثر',
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expiry: 'عرض مستمر',
    discount: 'تركيب مجاني',
    isHot: false,
    category: 'التركيبات'
  },
  {
    id: '3',
    title: 'عرض البطاريات الذكية',
    description: 'خصم 15% على بطاريات الليثيوم مع ضمان 5 سنوات',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expiry: 'ينتهي في 30 نوفمبر',
    discount: '15%',
    isHot: true,
    category: 'البطاريات'
  },
  {
    id: '4',
    title: 'أنظمة الطاقة الهجينة',
    description: 'حلول متكاملة للطاقة الشمسية مع مولدات احتياطية',
    image: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expiry: 'ينتهي في 10 يناير',
    discount: '10%',
    isHot: false,
    category: 'أنظمة متكاملة'
  },
];

export default function AdsScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const cardHeight = isLandscape ? height * 0.6 : width * 0.6;

  const renderOfferItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { height: cardHeight }]}
      onPress={() => navigation.navigate('OfferDetail', { offer: item })}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.cardImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.cardContent}>
        <View style={styles.badgeContainer}>
          {item.isHot && (
            <View style={styles.hotBadge}>
              <MaterialIcons name="local-fire-department" size={16} color="#FFF" />
              <Text style={styles.hotText}>عرض حصري</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        
        <Text style={styles.discountBadge}>{item.discount}</Text>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <View style={styles.expiryContainer}>
            <MaterialIcons name="access-time" size={14} color="#F59E0B" />
            <Text style={styles.expiry}>{item.expiry}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>العروض والتخفيضات</Text>
          {/* <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color="#3B82F6" />
          </TouchableOpacity> */}
        </View>
        
        <FlatList
          data={mockOffers}
          renderItem={renderOfferItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={styles.listHeader} />}
          ListFooterComponent={<View style={styles.listFooter} />}
          key={isLandscape ? 'landscape' : 'portrait'} // Force re-render on orientation change
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 22,
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listHeader: {
    height: 10,
  },
  listFooter: {
    height: 30,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  badgeContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hotBadge: {
    flexDirection: 'row-reverse',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: 12,
    color: '#FFF',
  },
  hotText: {
    color: '#FFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 12,
    marginRight: 5,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontFamily: 'Tajawal-Bold',
    fontSize: 14,
    color: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  textContainer: {
    marginTop: 8,
  },
  title: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 20,
    lineHeight: 28,
    color: '#FFF',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#E5E7EB',
    textAlign: 'right',
    marginVertical: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  expiryContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 4,
  },
  expiry: {
    fontFamily: 'Tajawal-Medium',
    fontSize: 13,
    color: '#F59E0B',
    textAlign: 'right',
    marginRight: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});