import { useState, useRef, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  StyleSheet,
  Platform,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from "../components/ProductCard";
import ShopCard from "../components/ShopCard";
import EngineerCard from "../components/EngineerCard";
import MarketplaceFilter from "../components/MarketplaceFilter";
import { navigate } from "../navigation/navigationHelper";
import { useTranslation } from "react-i18next";
import { useMarketplace } from "../hooks/useMarketplace";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
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

export default function MarketplaceScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [filters, setFilters] = useState({
    productType: "",
    condition: "",
    priceRange: [0, 1000000],
    governorate: "",
  });

  // Use the marketplace hook
  const {
    products,
    engineers,
    shops,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    likeProduct,
    unlikeProduct
  } = useMarketplace(filters, activeTab);

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
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  const handleLoadMore = (type) => {
    if (hasNextPage[type] && !isFetchingNextPage[type]) {
      fetchNextPage[type]();
    }
  };

  const handleLikeProduct = (productId) => {
    if (!user) {
      navigate('AuthStack', {
        screen: 'Auth',
        params: { returnData: { screen: 'Marketplace', action: 'like', productId } }
      });
      return;
    }
    likeProduct(productId);
  };

  const handleUnlikeProduct = (productId) => {
    if (!user) {
      navigate('AuthStack', {
        screen: 'Auth',
        params: { returnData: { screen: 'Marketplace', action: 'unlike', productId } }
      });
      return;
    }
    unlikeProduct(productId);
  };

  const renderFooter = (type) => {
    if (!hasNextPage[type]) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#16A34A" />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {t('MARKETPLACE.NO_RESULTS')}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        {error?.message || t('COMMON.SOMETHING_WENT_WRONG')}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => refetch()}
      >
        <Text style={styles.retryButtonText}>{t('COMMON.RETRY')}</Text>
      </TouchableOpacity>
    </View>
  );

  // Helper to get ID (supports both id and _id)
  const getId = (item) => item.id || item._id;

  // Category configuration
  const categories = [
    { id: 'all', name: t('COMMON.ALL'), icon: 'view-grid', count: products.length + shops.length + engineers.length },
    { id: 'products', name: t('MARKETPLACE.LISTINGS'), icon: 'solar-panel-large', count: products.length },
    { id: 'shops', name: t('SHOP.TITLE'), icon: 'store', count: shops.length },
    { id: 'engineers', name: t('ENGINEERS.TITLE'), icon: 'account-hard-hat', count: engineers.length },
    { id: 'solarPanels', name: t('PRODUCT_TYPES.PANEL'), icon: 'solar-panel', count: products.filter(p => p.type === 'panel').length },
    { id: 'inverters', name: t('PRODUCT_TYPES.INVERTER'), icon: 'sine-wave', count: products.filter(p => p.type === 'inverter').length },
    { id: 'batteries', name: t('PRODUCT_TYPES.BATTERY'), icon: 'battery', count: products.filter(p => p.type === 'battery').length }
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#16A34A', '#15803D']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>{t('MARKETPLACE.TITLE')}</Text>
                <Text style={styles.subtitle}>{t('MARKETPLACE.SUBTITLE')}</Text>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => navigate("Search")}
                accessibilityLabel={t('COMMON.SEARCH')}
                accessibilityRole="button"
              >
                <MaterialIcons name="search" size={24} color="#16A34A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
                accessibilityLabel={t('COMMON.FILTERS')}
                accessibilityRole="button"
              >
                <FontAwesome name="sliders" size={16} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>{t('COMMON.FILTERS')}</Text>
              </TouchableOpacity>
              
              <View style={styles.locationTag}>
                <Ionicons name="location-sharp" size={14} color="#FFFFFF" />
                <Text style={styles.locationText}>
                  {t('GOVERNORATES.SANAA')}, {t('CITIES.NEW')}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
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

  const renderContent = () => {
    if (isLoading && !products.length && !engineers.length && !shops.length) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return renderError();
    }

    return (
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}> 
        {/* Products Section */}
        {products.length > 0 && (
          <View style={styles.section}>
            {activeTab === 'all' && (
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.sectionTitle}>{t('MARKETPLACE.LISTINGS')}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveTab('products')}>
                  <Text style={styles.seeAllText}>{t('COMMON.SEE_ALL')}</Text>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigate("ProductDetail", { product: item })}
                  style={styles.productCard}
                >
                  <ProductCard 
                    product={item}
                    onLike={() => handleLikeProduct(getId(item))}
                    onUnlike={() => handleUnlikeProduct(getId(item))}
                    isLiked={user?.likedProducts?.includes(getId(item))}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => getId(item)?.toString()}
              numColumns={isTablet ? 3 : 2}
              columnWrapperStyle={styles.columnWrapper}
              onEndReached={() => handleLoadMore('products')}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => (
                isFetchingNextPage.products ? renderFooter('products') : null
              )}
              ListEmptyComponent={!isLoading ? renderEmptyState : null}
            />
          </View>
        )}

        {/* Engineers Section */}
        {engineers.length > 0 && (
          <View style={styles.section}>
            {activeTab === 'all' && (
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.sectionTitle}>{t('ENGINEERS.TITLE')}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveTab('engineers')}>
                  <Text style={styles.seeAllText}>{t('COMMON.SEE_ALL')}</Text>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={engineers}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigate("EngineerDetail", { engineer: item })}
                  style={styles.fullWidthCard}
                >
                  <EngineerCard engineer={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => getId(item)?.toString()}
              onEndReached={() => handleLoadMore('engineers')}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => renderFooter('engineers')}
              ListEmptyComponent={!isLoading ? renderEmptyState : null}
            />
          </View>
        )}

        {/* Shops Section */}
        {shops.length > 0 && (
          <View style={styles.section}>
            {activeTab === 'all' && (
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.sectionTitle}>{t('SHOP.TITLE')}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveTab('shops')}>
                  <Text style={styles.seeAllText}>{t('COMMON.SEE_ALL')}</Text>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={shops}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigate("Shop", { shop: item })}
                  style={[styles.fullWidthCard, isTablet && styles.tabletCard]}
                >
                  <ShopCard shop={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => getId(item)?.toString()}
              numColumns={isTablet ? 2 : 1}
              columnWrapperStyle={isTablet ? styles.columnWrapper : null}
              onEndReached={() => handleLoadMore('shops')}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => renderFooter('shops')}
              ListEmptyComponent={!isLoading ? renderEmptyState : null}
            />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#16A34A" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={['#16A34A']}
              tintColor="#16A34A"
            />
          }
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderHeader()}
          {renderCategoryTabs()}
          {renderContent()}
        </ScrollView>

        <MarketplaceFilter
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setShowFilters(false);
          }}
          initialFilters={filters}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(16),
    paddingHorizontal: scaleSize(4),
    position: 'relative', // Add this
    paddingTop:40,
  paddingBottom:10
  },

  sectionTitle: {
  fontFamily: 'Tajawal-Bold',
  fontSize: scaleFont(30),
  color: '#1E293B',
  textAlign: 'center', // Add this
},
titleContainer: {
  position: 'absolute',
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop:10,
  paddingBottom:10
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
  footerLoader: {
    paddingVertical: scaleSize(20),
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: scaleSize(20),
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(16),
    color: '#EF4444',
    marginBottom: scaleSize(10),
  },
  retryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(20),
    borderRadius: scaleSize(10),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Medium',
    fontSize: scaleFont(16),
  },
});