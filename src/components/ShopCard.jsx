// src/components/ShopCard.jsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ShopCard({ shop }) {
  return (
    <View style={styles.card}>
      <Text style={styles.shopName}>{shop.name}</Text>
      <Text style={styles.location}>{shop.city}, {shop.governorate}</Text>
      <Text style={styles.services}>
        الخدمات: {shop.services.join('، ')}
      </Text>
      <Text style={styles.phone}>الهاتف: {shop.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#1E3A8A',
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#666',
    textAlign: 'right',
  },
  phone: {
    fontSize: 14,
    fontFamily: 'Tajawal-Regular',
    color: '#1E3A8A',
    textAlign: 'right',
  },
});