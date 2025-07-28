import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from '@tanstack/react-query';
import { adsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/EmptyState';

// Fallback mock data - always available
const mockOffers = [
  {
    _id: "1",
    title: "خصم 25% على الألواح الشمسية",
    description: "عرض خاص لفترة محدودة على ألواح جينكو 450 واط",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    endDate: null,
    priority: 9,
    placement: "الطاقة الشمسية",
    clicks: { count: 15 },
    isActive: true,
    isApproved: true,
  },
  {
    _id: "2", 
    title: "تركيب مجاني مع شراء النظام الكامل",
    description: "احصل على تركيب مجاني عند شراء نظام 5 كيلو واط أو أكثر",
    imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    endDate: null,
    priority: 7,
    placement: "التركيبات",
    clicks: { count: 8 },
    isActive: true,
    isApproved: true,
  },
  {
    _id: "3",
    title: "عرض البطاريات الذكية",
    description: "خصم 15% على بطاريات الليثيوم مع ضمان 5 سنوات",
    imageUrl: "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    endDate: "2024-12-31",
    priority: 8,
    placement: "البطاريات",
    clicks: { count: 22 },
    isActive: true,
    isApproved: true,
  },
];

// This screen is 100% PUBLIC - NO AUTH REQUIRED
export default function AdsScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [ads, setAds] = useState(mockOffers); // Start with mock data
  const [isLoading, setIsLoading] = useState(false);

  // Try to fetch real ads, but always show mock data if it fails
  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await adsAPI.getAds({ 
        page: 1, 
        limit: 20,
        isActive: true,
        isApproved: true 
      });
      
      if (response?.data?.data && response.data.data.length > 0) {
        setAds(response.data.data);
      } else {
        // Use mock data if no real ads
        setAds(mockOffers);
      }
    } catch (error) {
      // Always use mock data if API fails
      console.log('Using mock data - API not available');
      setAds(mockOffers);
    } finally {
      setIsLoading(false);
    }
  };

  // Load ads on mount
  React.useEffect(() => {
    fetchAds();
  }, []);

  const renderOfferItem = ({ item }) => {
    const isExpired = item.endDate && new Date(item.endDate) < new Date();
    
    return (
      <TouchableOpacity
        style={[styles.card, isExpired && styles.expiredCard]}
        onPress={() => {
          if (item.targetUrl) {
            console.log('Opening:', item.targetUrl);
          }
        }}
        activeOpacity={0.95}
      >
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => {
              console.log('Image failed to load:', item.imageUrl);
            }}
          />

          {item.priority >= 8 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>عرض مميز</Text>
            </View>
          )}

          {item.priority >= 9 && (
            <View style={styles.hotBadge}>
              <MaterialIcons
                name="local-fire-department"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.hotText}>عرض حصري</Text>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.placement}</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.expiryContainer}>
            <MaterialIcons name="access-time" size={16} color="#6B7280" />
            <Text style={styles.expiry}>
              {item.endDate 
                ? isExpired 
                  ? 'انتهى العرض' 
                  : `ينتهي في ${new Date(item.endDate).toLocaleDateString('ar-YE')}`
                : 'عرض مستمر'
              }
            </Text>
          </View>

          {item.clicks?.count > 0 && (
            <View style={styles.analyticsContainer}>
              <MaterialIcons name="mouse" size={16} color="#16A34A" />
              <Text style={styles.analyticsText}>
                {item.clicks.count} نقرة
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>العروض والتخفيضات</Text>
          <Text style={styles.headerSubtitle}>
            {ads.length} عرض متاح
          </Text>
        </View>

        <FlatList
          data={ads}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={styles.listHeader} />}
          ListFooterComponent={<View style={styles.listFooter} />}
          ListEmptyComponent={
            <EmptyState 
              title="لا توجد عروض"
              subtitle="لا توجد عروض متاحة حالياً"
              iconName="local-offer"
              actionText="إعادة التحديث"
              onAction={fetchAds}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchAds}
              colors={["#16A34A"]}
              tintColor="#16A34A"
            />
          }
          key={isLandscape ? "landscape" : "portrait"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "right",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  listHeader: {
    height: 8,
  },
  listFooter: {
    height: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  expiredCard: {
    opacity: 0.6,
  },
  cardHeader: {
    position: "relative",
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  hotBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#F97316",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  hotText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "right",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "right",
  },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  expiry: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 4,
  },
  analyticsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  analyticsText: {
    fontSize: 12,
    color: "#16A34A",
    marginRight: 4,
    fontWeight: "500",
  },
});
