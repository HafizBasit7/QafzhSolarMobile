import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';

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
    isDeleting
  } = useProducts({ user_id: user?._id });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = (productId) => {
    Alert.alert(
      t('COMMON.CONFIRM_DELETE'),
      t('PRODUCT.DELETE_CONFIRMATION'),
      [
        {
          text: t('COMMON.CANCEL'),
          style: 'cancel'
        },
        { 
          text: t('COMMON.DELETE'), 
          onPress: () => deleteProduct(productId),
          style: 'destructive'
        }
      ]
    );
  };

  const handleEdit = (productId) => {
    navigation.navigate('EditProduct', { productId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <ProductCard product={item} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEdit(item._id)}
        >
          <MaterialIcons name="edit" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDelete(item._id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <MaterialIcons name="delete" size={24} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footer}>
        {isFetchingNextPage && <ActivityIndicator size="large" color="#16A34A" />}
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
        title={t('COMMON.ERROR')}
        message={error?.message || t('COMMON.SOMETHING_WENT_WRONG')}
        actionText={t('COMMON.RETRY')}
        onAction={refetch}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState 
        icon="inventory"
        title={t('PRODUCT.NO_PRODUCTS_TITLE')}
        message={t('PRODUCT.NO_PRODUCTS_MESSAGE')}
        actionText={t('PRODUCT.ADD_FIRST_PRODUCT')}
        onAction={() => navigation.navigate('ProductSubmission')}
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
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  productContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default MyProductsScreen;