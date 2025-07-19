import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, Image, ScrollView } from "react-native";
import ProductCard from "../components/ProductCard";
import SellProductButton from "../components/SellProductButton";
import MarketplaceFilter from "../components/MarketplaceFilter";
import { navigate } from "../navigation/navigationHelper";
import ar from "../locales/ar";
import ShopCard from "../components/ShopCard";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker'; // Correct import

// Mock data remains the same...
// Mock data
// Real solar product images
const PRODUCT_IMAGES = {
  solarPanels: [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ],
  inverters: [
    'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ],
  batteries: [
    'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1605152511803-b9b4d39a449a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ],
  shops: [
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ]
};

// Enhanced mock data with real images
const mockProducts = [
  {
    id: "1",
    title: "لوح شمسي 300 واط",
    price: "150,000",
    currency: "YER",
    condition: "جديد",
    type: "ألواح شمسية",
    brand: "Jinko",
    location: "صنعاء",
    images: [PRODUCT_IMAGES.solarPanels[0]],
    isVerified: false,
  },
  {
    id: "2",
    title: "انفرتر 5 كيلو واط",
    price: "350,000",
    currency: "YER",
    condition: "مستعمل",
    type: "انفرتر",
    brand: "SMA",
    location: "عدن",
    images: [PRODUCT_IMAGES.inverters[0]],
    isVerified: false,
  },
  {
    id: "3",
    title: "بطارية ليثيوم 10 كيلو واط",
    price: "450,000",
    currency: "YER",
    condition: "جديد",
    type: "بطارية",
    brand: "Tesla",
    location: "تعز",
    images: [PRODUCT_IMAGES.batteries[0]],
    isVerified: false,
  },
  {
    id: "4",
    title: "شاحن شمسي متنقل",
    price: "75,000",
    currency: "YER",
    condition: "جديد",
    type: "ملحقات",
    brand: "Anker",
    location: "حضرموت",
    images: [PRODUCT_IMAGES.accessories[0]],
    isVerified: false,
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
    image: PRODUCT_IMAGES.shops[0]
  },
  {
    id: "s2",
    name: "مركز حلول الطاقة",
    city: "صنعاء",
    governorate: "صنعاء",
    phone: "+967712345679",
    services: ["بيع", "تركيب", "صيانة"],
    isVerified: true,
    image: PRODUCT_IMAGES.shops[1]
  },
  {
    id: "s3",
    name: "تكنولوجيا الطاقة الشمسية",
    city: "تعز",
    governorate: "تعز",
    phone: "+967712345680",
    services: ["بيع", "استشارات"],
    isVerified: true,
    image: PRODUCT_IMAGES.shops[2]
  }
];

export default function MarketplaceScreen() {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'products', 'shops'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    productType: "",
    condition: "",
    priceRange: [0, 1000000],
    governorate: "",
  });

  const handleSellProduct = () => {
    navigate("ProductSubmission");
  };

  const filteredProducts = mockProducts.filter((product) => {
    // Apply filters here
    return true;
  });

  const filteredShops = mockShops.filter((shop) => {
    // Apply filters here
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{ar.MARKETPLACE.TITLE}</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigate("Search")}
          >
            <MaterialIcons name="search" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <FontAwesome name="sliders" size={16} color="#1E40AF" />
            <Text style={styles.filterButtonText}>{ar.COMMON.FILTERS}</Text>
          </TouchableOpacity>
          
          <View style={styles.locationTag}>
            <Ionicons name="location-sharp" size={14} color="#1E40AF" />
            <Text style={styles.locationText}>صنعاء</Text>
          </View>
        </View>
      </View>

      {/* Promotional Banner */}
      <View style={styles.bannerContainer}>
        <Image 
          source={{uri: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerText}>خصم 20% على الألواح الشمسية هذا الأسبوع</Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
              الكل
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "products" && styles.activeTab]}
            onPress={() => setActiveTab("products")}
          >
            <Text style={[styles.tabText, activeTab === "products" && styles.activeTabText]}>
              منتجات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "shops" && styles.activeTab]}
            onPress={() => setActiveTab("shops")}
          >
            <Text style={[styles.tabText, activeTab === "shops" && styles.activeTabText]}>
              متاجر
            </Text>
          </TouchableOpacity>
          
          {/* Additional category tabs */}
          <TouchableOpacity
            style={[styles.tab, styles.categoryTab]}
            onPress={() => setActiveTab("solarPanels")}
          >
            <Text style={styles.tabText}>
              ألواح شمسية
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, styles.categoryTab]}
            onPress={() => setActiveTab("inverters")}
          >
            <Text style={styles.tabText}>
              انفرترات
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, styles.categoryTab]}
            onPress={() => setActiveTab("batteries")}
          >
            <Text style={styles.tabText}>
              بطاريات
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {(activeTab === "all" || activeTab === "products") && (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigate("ProductDetail", { product: item })}
                style={styles.cardWrapper}
              >
                <ProductCard product={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}

        {(activeTab === "all" || activeTab === "shops") && (
          <FlatList
            data={filteredShops}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigate("ShopDetail", { shop: item })}
                style={styles.cardWrapper}
              >
                <ShopCard shop={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Sell Product Button */}
      <SellProductButton onPress={handleSellProduct} />

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
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: "Tajawal-Bold",
    color: "#1E3A8A",
  },
  searchButton: {
    backgroundColor: "#EDF2F7",
    padding: 8,
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  filterButtonText: {
    color: "#1E40AF",
    fontFamily: "Tajawal-Medium",
    fontSize: 14,
  },
  locationTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    color: "#1E40AF",
    fontFamily: "Tajawal-Medium",
    fontSize: 13,
  },
  bannerContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 16,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
  },
  bannerText: {
    color: '#FFF',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    textAlign: 'right',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabsScrollContent: {
    gap: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF2F7',
  },
  activeTab: {
    backgroundColor: '#1E40AF',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabText: {
    fontFamily: "Tajawal-Medium",
    color: "#4B5563",
    fontSize: 14,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
  },
};