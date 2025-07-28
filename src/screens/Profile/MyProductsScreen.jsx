import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";

const MyProductsScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Use user_id filter to get only user's products
  const {
    products,
    totalCount,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    deleteProduct,
    isDeleting,
  } = useProducts({ user_id: user?.data?.user?._id || user?._id });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      productId: product._id,
      product: product 
    });
  };

  const handleDelete = (productId) => {
    Alert.alert(
      "تأكيد الحذف", 
      "هل أنت متأكد من حذف هذا المنتج؟", 
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "حذف",
          onPress: () => {
            if (deleteProduct) {
              deleteProduct(productId);
            } else {
              console.error('Delete function not available');
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <ProductCard product={item} />
      </TouchableOpacity>
      
      <View style={styles.cardOverlay}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'approved' ? '#10B981' : '#F59E0B' }
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'approved' ? 'مقبول' : 'قيد المراجعة'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleDelete(item._id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialIcons name="delete" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footer}>
        {isFetchingNextPage && (
          <ActivityIndicator size="large" color="#16A34A" />
        )}
      </View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon="error"
        title="خطأ"
        message={error?.message || "حدث خطأ أثناء تحميل المنتجات"}
        actionText="إعادة المحاولة"
        onAction={refetch}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="inventory"
        title="لا توجد منتجات"
        message="لم تقم بنشر أي منتجات بعد. ابدأ بإضافة منتجك الأول!"
        actionText="إضافة منتج"
        onAction={() => navigation.navigate("ProductSubmission")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>منتجاتي ({totalCount})</Text>
      </View>
      
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#16A34A"]}
            tintColor="#16A34A"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  productContainer: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    zIndex: 10,
  },
  statusContainer: {
    // No absolute positioning needed now
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default MyProductsScreen;
