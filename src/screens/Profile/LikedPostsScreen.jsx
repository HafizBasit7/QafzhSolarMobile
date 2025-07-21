import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LikedPostsScreen = () => {
  const likedPosts = [
    { id: '1', title: 'لوح شمسي 500 وات', price: '150,000 ريال' },
    { id: '2', title: 'انفرتر 2000 وات', price: '200,000 ريال' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>المحفوظات</Text>
      
      <FlatList
        data={likedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postPrice}>{item.price}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 24,
    textAlign: 'right',
    marginBottom: 20,
    color: '#1E293B',
  },
  postItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postTitle: {
    fontFamily: 'Tajawal-Medium',
    fontSize: 16,
    textAlign: 'right',
    color: '#1E293B',
  },
  postPrice: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 14,
    textAlign: 'right',
    color: '#64748B',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default LikedPostsScreen;