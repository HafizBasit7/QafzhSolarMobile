import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

  const {
    products,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    deleteProduct,
    isDeleting,
  } = useProducts({ user_id: user?._id });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = (productId) => {
    Alert.alert(t("COMMON.CONFIRM_DELETE"), t("PRODUCT.DELETE_CONFIRMATION"), [
      {
        text: t("COMMON.CANCEL"),
        style: "cancel",
      },
      {
        text: t("COMMON.DELETE"),
        onPress: () => deleteProduct(productId),
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <View style={styles.cardHeader}>
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

      <ProductCard product={item} />
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
        title={t("COMMON.ERROR")}
        message={error?.message || t("COMMON.SOMETHING_WENT_WRONG")}
        actionText={t("COMMON.RETRY")}
        onAction={refetch}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="inventory"
        title={t("PRODUCT.NO_PRODUCTS_TITLE")}
        message={t("PRODUCT.NO_PRODUCTS_MESSAGE")}
        actionText={t("PRODUCT.ADD_FIRST_PRODUCT")}
        onAction={() => navigation.navigate("ProductSubmission")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
  },
  cardHeader: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
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
});

export default MyProductsScreen;
