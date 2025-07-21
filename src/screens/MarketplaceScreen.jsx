import { useState, useRef , useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Image, 
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  StyleSheet,
  Platform,
  RefreshControl
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from "../components/ProductCard";
import ShopCard from "../components/ShopCard";
import EngineerCard from "../components/EngineerCard";
import MarketplaceFilter from "../components/MarketplaceFilter";
import { navigate } from "../navigation/navigationHelper";
import ar from "../locales/ar";

import { MaterialIcons, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Responsive dimensions calculation
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

// Enhanced responsive scaling functions
const scaleSize = (size) => {
  const scaleFactor = isTablet ? 1.2 : isSmallDevice ? 0.9 : 1;
  return size * scaleFactor;
};

const scaleFont = (size) => {
  const scaleFactor = isTablet ? 1.15 : isSmallDevice ? 0.95 : 1;
  return size * scaleFactor;
};
// Enhanced product images with better quality
const PRODUCT_IMAGES = {
  solarPanels: [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
  ],
  inverters: [
    'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
  ],
  batteries: [
    'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1605152511803-b9b4d39a449a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
  ],
  shops: [
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90'
  ],
  engineers: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ]
};

// Enhanced mock data
const mockProducts = [
  {
    id: "1",
    title: "لوح شمسي 300 واط - Jinko Solar",
    price: "150,000",
    currency: "YER",
    condition: "جديد",
    type: "ألواح شمسية",
    brand: "Jinko",
    location: "صنعاء",
    images: PRODUCT_IMAGES.solarPanels,
    isVerified: true,
    rating: 4.8,
    reviews: 24,
    description: "لوح شمسي عالي الكفاءة من شركة جينكو الرائدة عالمياً",
  },
  {
    id: "2",
    title: "انفرتر هجين 5 كيلو واط - SMA",
    price: "350,000",
    currency: "YER",
    condition: "مستعمل",
    type: "انفرتر",
    brand: "SMA",
    location: "عدن",
    images: PRODUCT_IMAGES.inverters,
    isVerified: true,
    rating: 4.6,
    reviews: 18,
    description: "انفرتر هجين متطور مع تقنية MPPT",
  },
  {
    id: "3",
    title: "بطارية ليثيوم 10 كيلو واط - LiFePO4",
    price: "450,000",
    currency: "YER",
    condition: "جديد",
    type: "بطارية",
    brand: "Tesla",
    location: "تعز",
    images: PRODUCT_IMAGES.batteries,
    isVerified: true,
    rating: 4.9,
    reviews: 31,
    description: "بطارية ليثيوم عالية الأداء مع دورة حياة طويلة",
  },
  {
    id: "4",
    title: "شاحن شمسي متنقل 50 واط",
    price: "75,000",
    currency: "YER",
    condition: "جديد",
    type: "ملحقات",
    brand: "Anker",
    location: "حضرموت",
    images: PRODUCT_IMAGES.accessories,
    isVerified: false,
    rating: 4.4,
    reviews: 12,
    description: "شاحن شمسي محمول مقاوم للماء",
  },
  {
    id: "5",
    title: "لوح شمسي 450 واط - Canadian Solar",
    price: "200,000",
    currency: "YER",
    condition: "جديد",
    type: "ألواح شمسية",
    brand: "Canadian Solar",
    location: "الحديدة",
    images: PRODUCT_IMAGES.solarPanels,
    isVerified: true,
    rating: 4.7,
    reviews: 19,
    description: "لوح شمسي عالي القدرة مع تقنية PERC",
  },
  {
    id: "6",
    title: "انفرتر شبكي 10 كيلو واط - Huawei",
    price: "500,000",
    currency: "YER",
    condition: "جديد",
    type: "انفرتر",
    brand: "Huawei",
    location: "إب",
    images: PRODUCT_IMAGES.inverters,
    isVerified: true,
    rating: 4.8,
    reviews: 27,
    description: "انفرتر شبكي ذكي مع مراقبة عن بعد",
  }
];

const mockShops = [
  {
    id: "s1",
    name: "متجر الطاقة الخضراء",
    city: "عدن",
    governorate: "عدن",
    phone: "+967712345678",
    services: ["بيع", "تركيب"],
    isVerified: true,
    image: PRODUCT_IMAGES.shops[0],
    rating: 4.8,
    reviews: 156,
    establishedYear: 2018
  },
  {
    id: "s2",
    name: "مركز حلول الطاقة الشمسية",
    city: "صنعاء",
    governorate: "صنعاء",
    phone: "+967712345679",
    services: ["بيع", "تركيب", "صيانة"],
    isVerified: true,
    image: PRODUCT_IMAGES.shops[1],
    rating: 4.9,
    reviews: 203,
    establishedYear: 2015
  },
  {
    id: "s3",
    name: "تكنولوجيا الطاقة المتجددة",
    city: "تعز",
    governorate: "تعز",
    phone: "+967712345680",
    services: ["بيع", "استشارات", "تصميم"],
    isVerified: true,
    image: PRODUCT_IMAGES.shops[2],
    rating: 4.6,
    reviews: 89,
    establishedYear: 2020
  }
];

const mockEngineers = [
  {
    id: "e1",
    name: "م. أحمد محمد الصالحي",
    specialization: "مهندس أنظمة الطاقة الشمسية",
    experience: "8 سنوات",
    location: "صنعاء",
    phone: "+967771234567",
    email: "ahmed.solar@email.com",
    isVerified: true,
    image: PRODUCT_IMAGES.engineers[0],
    rating: 4.9,
    reviews: 47,
    completedProjects: 125,
    services: ["تصميم الأنظمة", "التركيب", "الصيانة", "الاستشارات"],
    certifications: ["معتمد من الطاقة المتجددة", "مهندس محترف"]
  },
  {
    id: "e2",
    name: "م. فاطمة عبدالله الزهراني",
    specialization: "مهندسة كهرباء - طاقة متجددة",
    experience: "6 سنوات",
    location: "عدن",
    phone: "+967771234568",
    email: "fatima.renewable@email.com",
    isVerified: true,
    image: PRODUCT_IMAGES.engineers[1],
    rating: 4.8,
    reviews: 32,
    completedProjects: 89,
    services: ["تصميم الأنظمة", "الاستشارات الفنية", "دراسات الجدوى"],
    certifications: ["ماجستير في الطاقة المتجددة", "معتمدة دولياً"]
  },
  {
    id: "e3",
    name: "م. خالد سالم البريكي",
    specialization: "مهندس تركيب وصيانة",
    experience: "5 سنوات",
    location: "تعز",
    phone: "+967771234569",
    email: "khalid.installation@email.com",
    isVerified: true,
    image: PRODUCT_IMAGES.engineers[2],
    rating: 4.7,
    reviews: 28,
    completedProjects: 76,
    services: ["تركيب الأنظمة", "الصيانة الدورية", "الإصلاح"],
    certifications: ["فني معتمد", "خبير تركيب"]
  },
  {
    id: "e4",
    name: "م. سارة محسن العامري",
    specialization: "مهندسة استشارات الطاقة",
    experience: "7 سنوات",
    location: "الحديدة",
    phone: "+967771234570",
    email: "sara.consulting@email.com",
    isVerified: true,
    image: PRODUCT_IMAGES.engineers[3],
    rating: 4.9,
    reviews: 41,
    completedProjects: 112,
    services: ["الاستشارات", "دراسات الجدوى", "التدريب"],
    certifications: ["دكتوراه في الطاقة المتجددة", "استشارية معتمدة"]
  }
];

// Category configuration
const categories = [
  { id: 'all', name: 'الكل', icon: 'view-grid', count: mockProducts.length + mockShops.length + mockEngineers.length },
  { id: 'products', name: 'منتجات', icon: 'solar-panel-large', count: mockProducts.length },
  { id: 'shops', name: 'متاجر', icon: 'store', count: mockShops.length },
  { id: 'engineers', name: 'مهندسون', icon: 'account-hard-hat', count: mockEngineers.length },
  { id: 'solarPanels', name: 'ألواح شمسية', icon: 'solar-panel', count: mockProducts.filter(p => p.type === 'ألواح شمسية').length },
  { id: 'inverters', name: 'انفرترات', icon: 'sine-wave', count: mockProducts.filter(p => p.type === 'انفرتر').length },
  { id: 'batteries', name: 'بطاريات', icon: 'battery', count: mockProducts.filter(p => p.type === 'بطارية').length }
];

export default function MarketplaceScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [filters, setFilters] = useState({
    productType: "",
    condition: "",
    priceRange: [0, 1000000],
    governorate: "",
  });

  

  const handleTabChange = (tabId) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setActiveTab(tabId);
      // Scroll to top when tab changes
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
  };
 // Memoized filtered data calculation
 const getFilteredData = useCallback(() => {
  switch (activeTab) {
    case 'products':
      return { products: mockProducts, shops: [], engineers: [] };
    case 'shops':
      return { products: [], shops: mockShops, engineers: [] };
    case 'engineers':
      return { products: [], shops: [], engineers: mockEngineers };
    case 'solarPanels':
      return { products: mockProducts.filter(p => p.type === 'ألواح شمسية'), shops: [], engineers: [] };
    case 'inverters':
      return { products: mockProducts.filter(p => p.type === 'انفرتر'), shops: [], engineers: [] };
    case 'batteries':
      return { products: mockProducts.filter(p => p.type === 'بطارية'), shops: [], engineers: [] };
    default:
      return { products: mockProducts, shops: mockShops, engineers: mockEngineers };
  }
}, [activeTab]);

const { products, shops, engineers } = getFilteredData();


const onRefresh = useCallback(() => {
  setRefreshing(true);
  setTimeout(() => setRefreshing(false), 1000);
}, []);


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#16A34A', '#15803D']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView  edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>سوق الطاقة الشمسية</Text>
                <Text style={styles.subtitle}>اكتشف أفضل المنتجات والخدمات</Text>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => navigate("Search")}
                accessibilityLabel="بحث"
                accessibilityRole="button"
              >
                <MaterialIcons name="search" size={24} color="#16A34A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
                accessibilityLabel="فلترة النتائج"
                accessibilityRole="button"
              >
                <FontAwesome name="sliders" size={16} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>فلترة</Text>
              </TouchableOpacity>
              
              <View style={styles.locationTag}>
                <Ionicons name="location-sharp" size={14} color="#FFFFFF" />
                <Text style={styles.locationText}>صنعاء، اليمن</Text>
              </View>
              
              {/* <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );

  const renderPromotionalBanner = () => (
    <View style={styles.bannerContainer}>
      <TouchableOpacity style={styles.bannerTouchable}
      activeOpacity={0.9}
      accessibilityRole="imagebutton"
      accessibilityLabel="عرض خاص على الألواح الشمسية"
      >
        <Image 
          source={{uri: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>خصم حتى 25%</Text>
            <Text style={styles.bannerSubtitle}>على جميع الألواح الشمسية</Text>
            <View style={styles.bannerCTA}>
              <Text style={styles.bannerCTAText}>تسوق الآن</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#FFF" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab, 
              activeTab === category.id && styles.activeCategoryTab
            ]}
            onPress={() => handleTabChange(category.id)}
            accessibilityLabel={`تصفية حسب ${category.name}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === category.id }}
          >
            <MaterialCommunityIcons 
              name={category.icon} 
              size={20} 
              color={activeTab === category.id ? '#FFFFFF' : '#16A34A'} 
            />
            <Text style={[
              styles.categoryTabText, 
              activeTab === category.id && styles.activeCategoryTabText
            ]}>
              {category.name}
            </Text>
            <View style={[
              styles.categoryBadge,
              activeTab === category.id && styles.activeCategoryBadge
            ]}>
              <Text style={[
                styles.categoryBadgeText,
                activeTab === category.id && styles.activeCategoryBadgeText
              ]}>
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => (
    <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
      {/* Products Section */}
      {products.length > 0 && (
        <View style={styles.section}>
          {activeTab === 'all' && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>المنتجات المميزة</Text>
              <TouchableOpacity onPress={() => setActiveTab('products')}
              accessibilityLabel="عرض جميع المنتجات"
                >
                <Text style={styles.seeAllText}>عرض الكل</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={products.slice(0, activeTab === 'all' ? (isTablet ? 6 : 4) : products.length)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigate("ProductDetail", { product: item })}
                style={styles.cardWrapper}
              >
                <ProductCard product={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            numColumns={isTablet ? 3 : 2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
          />
        </View>
      )}

      {/* Engineers Section */}
      {engineers.length > 0 && (
        <View style={styles.section}>
          {activeTab === 'all' && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>مهندسون خبراء</Text>
              <TouchableOpacity onPress={() => setActiveTab('engineers')}>
                <Text style={styles.seeAllText}>عرض الكل</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={engineers.slice(0, activeTab === 'all' ? 2 : engineers.length)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigate("EngineerDetail", { engineer: item })}
                style={styles.fullWidthCard}
              >
                <EngineerCard engineer={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
          />
        </View>
      )}

      {/* Shops Section */}
      {shops.length > 0 && (
        <View style={styles.section}>
          {activeTab === 'all' && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>متاجر موثوقة</Text>
              <TouchableOpacity onPress={() => setActiveTab('shops')}
                accessibilityLabel="عرض جميع المتاجر"
                >
                <Text style={styles.seeAllText}>عرض الكل</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={shops.slice(0, activeTab === 'all' ? (isTablet ? 4 : 3) : shops.length)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigate("ShopDetail", { shop: item })}
                style={[styles.fullWidthCard, isTablet && styles.tabletCard]}
              >
                <ShopCard shop={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={isTablet ? 2 : 1}
            columnWrapperStyle={isTablet ? styles.columnWrapper : null}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
          />
        </View>
      )}
    </Animated.View>
  );

  

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#16A34A" />

    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#16A34A" /> */}
      
      <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#16A34A']}
              tintColor="#16A34A"
            />
          }
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {renderHeader()}
        {renderPromotionalBanner()}
        {renderCategoryTabs()}
        {renderContent()}
      </ScrollView>

  

      {/* Filter Modal */}
      <MarketplaceFilter
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setShowFilters(false);
        }}
      />
    </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    maxWidth: 768, // Maximum width for tablet
    width: '100%',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scaleSize(80),
  },
  headerContainer: {
    elevation: 8,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: scaleSize(16),
    paddingVertical: scaleSize(12),
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scaleSize(16),
  },
  headerLeft: {
    flex: 1,
    marginRight: scaleSize(12),
  },
  title: {
    fontSize: scaleFont(28),
    fontFamily: "Tajawal-Bold",
    color: "#FFFFFF",
    marginBottom: scaleSize(4),
    textAlign: 'right',
  },
  subtitle: {
    fontSize: scaleFont(16),
    fontFamily: "Tajawal-Regular",
    color: "#E5F3E5",
    textAlign: 'right',
  },
  searchButton: {
    backgroundColor: "#FFFFFF",
    padding: scaleSize(12),
    borderRadius: scaleSize(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: scaleSize(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(16),
    borderRadius: scaleSize(20),
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: scaleSize(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontFamily: "Tajawal-Medium",
    fontSize: scaleFont(14),
  },
  locationTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: scaleSize(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(12),
    borderRadius: scaleSize(20),
  },
  locationText: {
    color: "#FFFFFF",
    fontFamily: "Tajawal-Medium",
    fontSize: scaleFont(13),
  },
  bannerContainer: {
    width: width - scaleSize(40),
    height: width * (isTablet ? 0.3 : 0.4),
    alignSelf: 'center',
    borderRadius: scaleSize(16),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: scaleSize(20),
    marginBottom: scaleSize(24),
  },
  bannerTouchable: {
    flex: 1,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  bannerContent: {
    padding: scaleSize(20),
  },
  bannerTitle: {
    color: '#FFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: scaleFont(24),
    marginBottom: scaleSize(4),
    textAlign: 'right',
  },
  bannerSubtitle: {
    color: '#E5E5E5',
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(16),
    marginBottom: scaleSize(12),
    textAlign: 'right',
  },
  bannerCTA: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(12),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: scaleSize(20),
  },
  bannerCTAText: {
    color: '#FFF',
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(14),
    marginLeft: scaleSize(4),
  },
  tabsContainer: {
    marginHorizontal: scaleSize(20),
    marginBottom: scaleSize(16),
  },
  tabsScrollContent: {
    paddingHorizontal: scaleSize(4),
    gap: scaleSize(8),
  },
  categoryTab: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(16),
    borderRadius: scaleSize(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: scaleSize(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeCategoryTab: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  categoryTabText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(14),
    color: '#16A34A',
    marginHorizontal: scaleSize(6),
  },
  activeCategoryTabText: {
    color: '#FFFFFF',
  },
  categoryBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: scaleSize(10),
    paddingHorizontal: scaleSize(6),
    paddingVertical: scaleSize(2),
  },
  activeCategoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryBadgeText: {
    fontFamily: 'Tajawal-Bold',
    fontSize: scaleFont(12),
    color: '#16A34A',
  },
  activeCategoryBadgeText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: scaleSize(16),
    paddingBottom: scaleSize(40),
  },
  section: {
    marginBottom: scaleSize(24),
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(16),
    paddingHorizontal: scaleSize(4),
  },
  sectionTitle: {
    fontFamily: 'Tajawal-Bold',
    fontSize: scaleFont(20),
    color: '#1E293B',
    
    
  },
  seeAllText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(14),
    color: '#16A34A',
  },
  productsList: {
    paddingBottom: scaleSize(8),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: scaleSize(16),
    gap: scaleSize(12),
  },
  cardWrapper: {
    width: isTablet ? 
      (width - scaleSize(64)) / 3 : // 3 columns for tablet
      (width - scaleSize(48)) / 2,  // 2 columns for phone
    marginBottom: scaleSize(16),
  },
  fullWidthCard: {
    marginBottom: scaleSize(16),
  },
  tabletCard: {
    width: (width - scaleSize(64)) / 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(40),
    minHeight: height * 0.4,
  },
  emptyText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(16),
    color: '#64748B',
    marginTop: scaleSize(16),
    textAlign: 'center',
  },
});