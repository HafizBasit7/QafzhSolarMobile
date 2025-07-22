import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import i18n from '../../config/i18n';

// Mock data for user's products
const mockProducts = [
  {
    id: '1',
    title: 'Vintage Polaroid Camera',
    price: '$75',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'Active',
    views: 124,
    date: 'Posted 3 days ago'
  },
  {
    id: '2',
    title: 'Leather Backpack',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'Sold',
    views: 89,
    date: 'Posted 2 weeks ago'
  },
  {
    id: '3',
    title: 'Wooden Coffee Table',
    price: '$150',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'Pending',
    views: 56,
    date: 'Posted 1 month ago'
  },
];

const MyProductsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.productMeta}>
          <View style={[styles.statusBadge, item.status === 'Sold' ? styles.soldBadge : styles.activeBadge]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.productViews}>{item.views} views</Text>
        </View>
        <Text style={styles.productDate}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <AntDesign name="edit" size={20} color="#5e72e4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#5e72e4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('PROFILE.MY_PRODUCTS')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
          <MaterialIcons name="add" size={28} color="#5e72e4" />
        </TouchableOpacity>
      </View>
      
      {mockProducts.length > 0 ? (
        <FlatList
          data={mockProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="inventory" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No products listed yet</Text>
          <Text style={styles.emptySubtext}>Add your first product to get started</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#32325d',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
    color: '#32325d',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Tajawal-Bold',
    color: '#5e72e4',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: '#d4edda',
  },
  soldBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Tajawal-Medium',
  },
  productViews: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#6e6e6e',
  },
  productDate: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#adb5bd',
  },
  editButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#32325d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#6e6e6e',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#5e72e4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#fff',
  },
});

export default MyProductsScreen;