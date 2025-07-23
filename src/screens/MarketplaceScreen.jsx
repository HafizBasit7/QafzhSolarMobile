import { useState, useRef, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  StyleSheet,
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

// Responsive dimensions
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const scaleSize = (size) => isTablet ? size * 1.2 : isSmallDevice ? size * 0.9 : size;
const scaleFont = (size) => isTablet ? size * 1.15 : isSmallDevice ? size * 0.95 : size;

export default function MarketplaceScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [filters, setFilters] = useState({
    productType: "",
    condition: "",
    priceRange: [0, 1000000],
    governorate: "",
  });

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
  } = useMarketplace({
    productType: activeTab === 'solarPanels' ? 'panel' : 
               activeTab === 'inverters' ? 'inverter' : 
               activeTab === 'batteries' ? 'battery' : '',
    governorate: filters.governorate,
    condition: filters.condition,
    priceRange: filters.priceRange
  }, activeTab);

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
    ]).start(() => setActiveTab(tabId));
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
      <Text style={styles.emptyText}>{t('MARKETPLACE.NO_RESULTS')}</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        {error?.message || t('COMMON.SOMETHING_WENT_WRONG')}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryButtonText}>{t('COMMON.RETRY')}</Text>
      </TouchableOpacity>
    </View>
  );

  const getId = (item) => item.id || item._id;

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
              >
                <MaterialIcons name="search" size={24} color="#16A34A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
                accessibilityLabel={t('COMMON.FILTERS')}
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
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryTab, 
              activeTab === item.id && styles.activeCategoryTab
            ]}
            onPress={() => handleTabChange(item.id)}
          >
            <MaterialCommunityIcons 
              name={item.icon} 
              size={20} 
              color={activeTab === item.id ? '#FFFFFF' : '#16A34A'} 
            />
            <Text style={[
              styles.categoryTabText, 
              activeTab === item.id && styles.activeCategoryTabText
            ]}>
              {item.name}
            </Text>
            <View style={[
              styles.categoryBadge,
              activeTab === item.id && styles.activeCategoryBadge
            ]}>
              <Text style={[
                styles.categoryBadgeText,
                activeTab === item.id && styles.activeCategoryBadgeText
              ]}>
                {item.count}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderSection = (type, data = [], titleKey, detailScreen, CardComponent) => {
    // Determine if section should be visible based on active tab
    const shouldRender = activeTab === 'all' || activeTab === type;
    if (!shouldRender) return null;
  
    // Safely handle data
    const sectionData = Array.isArray(data) ? data : [];
    const showEmptyState = !isLoading && sectionData.length === 0;
    const showHeader = activeTab === 'all' && sectionData.length > 0;
    const isProducts = type === 'products';
    const isShops = type === 'shops';
    const isEngineers = type === 'engineers';
  
    // Configuration for different types
    const typeConfig = {
      products: {
        numColumns: isTablet ? 3 : 2,
        cardStyle: styles.productCard,
        detailKey: 'product',
      },
      shops: {
        numColumns: isTablet ? 2 : 1,
        cardStyle: isTablet ? styles.tabletCard : styles.fullWidthCard,
        detailKey: 'shop',
      },
      engineers: {
        numColumns: 1,
        cardStyle: styles.fullWidthCard,
        detailKey: 'engineer',
      }
    };
  
    return (
      <View style={styles.section}>
        {/* Section Header - Only shown in 'all' tab */}
        {showHeader && (
          <View style={styles.sectionHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>{t(titleKey)}</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab(type)}>
              <Text style={styles.seeAllText}>{t('COMMON.SEE_ALL')}</Text>
            </TouchableOpacity>
          </View>
        )}
  
        {/* Empty State */}
        {showEmptyState ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {t(`MARKETPLACE.NO_${type.toUpperCase()}`)}
            </Text>
          </View>
        ) : (
          <FlatList
            data={sectionData}
            renderItem={({ item }) => {
              if (!item) return null;
              
              return (
                <TouchableOpacity
                  onPress={() => navigate(detailScreen, { [typeConfig[type].detailKey]: item })}
                  style={typeConfig[type].cardStyle}
                >
                  <CardComponent 
                    {...{ [typeConfig[type].detailKey]: item }}
                    {...(isProducts && {
                      onLike: () => handleLikeProduct(getId(item)),
                      onUnlike: () => handleUnlikeProduct(getId(item)),
                      isLiked: user?.likedProducts?.includes(getId(item))
                    })}
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item?.id || item?._id || Math.random().toString()}
            numColumns={typeConfig[type].numColumns}
            columnWrapperStyle={typeConfig[type].numColumns > 1 ? styles.columnWrapper : null}
            scrollEnabled={false}
            onEndReached={() => handleLoadMore(type)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage[type] ? (
                <ActivityIndicator size="small" style={styles.loader} />
              ) : null
            }
          />
        )}
      </View>
    );
  };
  


  const renderContent = () => {
    if (isLoading && !products.length && !engineers.length && !shops.length) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return renderError();
    }

    return (
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {products.length > 0 && renderSection('products', products, 'MARKETPLACE.LISTINGS', 'ProductDetailScreen', ProductCard)}
        {engineers.length > 0 && renderSection('engineers', engineers, 'ENGINEERS.TITLE', 'EngineerDetailScreens', EngineerCard)}
        {shops.length > 0 && renderSection('shops', shops, 'SHOP.TITLE', 'ShopScreen', ShopCard)}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#16A34A" />
      <View style={styles.container}>
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              {renderHeader()}
              {renderCategoryTabs()}
            </>
          }
          ListFooterComponent={renderContent()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={['#16A34A']}
              tintColor="#16A34A"
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

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
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1
  },
  headerContainer: {
    marginBottom: scaleSize(10)
  },
  headerGradient: {
    paddingBottom: scaleSize(15)
  },
  header: {
    paddingHorizontal: scaleSize(15)
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(15)
  },
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scaleSize(2)
  },
  subtitle: {
    fontSize: scaleFont(14),
    color: 'rgba(255,255,255,0.8)'
  },
  searchButton: {
    backgroundColor: '#FFFFFF',
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSize(10)
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(12),
    borderRadius: scaleSize(20),
    alignItems: 'center',
    marginRight: scaleSize(10)
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(12),
    marginLeft: scaleSize(5)
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: scaleFont(12),
    marginLeft: scaleSize(3)
  },
  tabsContainer: {
    paddingVertical: scaleSize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  tabsScrollContent: {
    paddingHorizontal: scaleSize(15)
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(8),
    borderRadius: scaleSize(20),
    marginRight: scaleSize(8)
  },
  activeCategoryTab: {
    backgroundColor: '#16A34A'
  },
  categoryTabText: {
    fontSize: scaleFont(12),
    color: '#16A34A',
    marginHorizontal: scaleSize(5)
  },
  activeCategoryTabText: {
    color: '#FFFFFF'
  },
  categoryBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: scaleSize(10),
    paddingHorizontal: scaleSize(6),
    paddingVertical: scaleSize(2)
  },
  activeCategoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  categoryBadgeText: {
    fontSize: scaleFont(10),
    color: '#166534',
    fontWeight: 'bold'
  },
  activeCategoryBadgeText: {
    color: '#FFFFFF'
  },
  contentContainer: {
    padding: scaleSize(15)
  },
  section: {
    marginBottom: scaleSize(20)
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(15)
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#1F2937'
  },
  seeAllText: {
    fontSize: scaleFont(12),
    color: '#16A34A',
    fontWeight: '500'
  },
  productCard: {
    flex: 1,
    margin: scaleSize(5),
    maxWidth: isTablet ? '33.33%' : '50%'
  },
  fullWidthCard: {
    marginBottom: scaleSize(10)
  },
  tabletCard: {
    flex: 1,
    marginHorizontal: scaleSize(5)
  },
  columnWrapper: {
    justifyContent: 'space-between'
  },
  footerLoader: {
    paddingVertical: scaleSize(10)
  },
  emptyState: {
    paddingVertical: scaleSize(40),
    alignItems: 'center'
  },
  emptyText: {
    fontSize: scaleFont(16),
    color: '#6B7280'
  },
  errorContainer: {
    paddingVertical: scaleSize(40),
    alignItems: 'center'
  },
  errorText: {
    fontSize: scaleFont(16),
    color: '#EF4444',
    marginBottom: scaleSize(15),
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(10),
    borderRadius: scaleSize(5)
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});