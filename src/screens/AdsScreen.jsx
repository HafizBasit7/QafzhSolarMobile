import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

// Mock offers data
const mockOffers = [
  {
    id: "1",
    title: "خصم 25% على الألواح الشمسية",
    description: "عرض خاص لفترة محدودة على ألواح جينكو 450 واط",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    expiry: "ينتهي في 15 ديسمبر",
    discount: "25%",
    isHot: true,
    category: "الطاقة الشمسية",
  },
  {
    id: "2",
    title: "تركيب مجاني مع شراء النظام الكامل",
    description: "احصل على تركيب مجاني عند شراء نظام 5 كيلو واط أو أكثر",
    image:
      "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    expiry: "عرض مستمر",
    discount: "تركيب مجاني",
    isHot: false,
    category: "التركيبات",
  },
  {
    id: "3",
    title: "عرض البطاريات الذكية",
    description: "خصم 15% على بطاريات الليثيوم مع ضمان 5 سنوات",
    image:
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    expiry: "ينتهي في 30 نوفمبر",
    discount: "15%",
    isHot: true,
    category: "البطاريات",
  },
  {
    id: "4",
    title: "أنظمة الطاقة الهجينة",
    description: "حلول متكاملة للطاقة الشمسية مع مولدات احتياطية",
    image:
      "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    expiry: "ينتهي في 10 يناير",
    discount: "10%",
    isHot: false,
    category: "أنظمة متكاملة",
  },
];

export default function AdsScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const cardHeight = isLandscape ? height * 0.6 : width * 0.6;

  const renderOfferItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("OfferDetail", { offer: item })}
      activeOpacity={0.95}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Discount Badge */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>

        {/* Hot Badge */}
        {item.isHot && (
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
        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Expiry */}
        <View style={styles.expiryContainer}>
          <MaterialIcons name="access-time" size={16} color="#6B7280" />
          <Text style={styles.expiry}>{item.expiry}</Text>
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={styles.listHeader} />}
          ListFooterComponent={<View style={styles.listFooter} />}
          key={isLandscape ? "landscape" : "portrait"} // Force re-render on orientation change
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontFamily: "Tajawal-Bold",
    fontSize: 24,
    color: "#1F2937",
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listHeader: {
    height: 16,
  },
  listFooter: {
    height: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    position: "relative",
    height: 200,
    backgroundColor: "#F8FAFC",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#16A34A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  hotBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row-reverse",
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  hotText: {
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
    fontSize: 12,
    marginRight: 4,
  },
  cardBody: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryText: {
    fontFamily: "Tajawal-Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  title: {
    fontFamily: "Tajawal-Bold",
    fontSize: 18,
    lineHeight: 24,
    color: "#1F2937",
    textAlign: "right",
    marginBottom: 8,
  },
  description: {
    fontFamily: "Tajawal-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "right",
    marginBottom: 12,
  },
  expiryContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  expiry: {
    fontFamily: "Tajawal-Medium",
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
  },
});
