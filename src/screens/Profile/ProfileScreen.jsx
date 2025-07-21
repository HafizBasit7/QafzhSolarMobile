import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    {
      title: 'تعديل الملف الشخصي',
      icon: 'person-circle-outline',
      onPress: () => navigation.navigate('UpdateProfile'),
    },
    {
      title: 'المحفوظات',
      icon: 'bookmark-outline',
      onPress: () => navigation.navigate('LikedPosts'),
    },
    {
      title: 'منتجاتي',
      icon: 'cart-outline',
      onPress: () => navigation.navigate('MyProducts'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الملف الشخصي</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <View style={styles.menuContent}>
            <Ionicons
              name={item.icon}
              size={24}
              color="#0F172A"
              style={styles.icon}
            />
            <Text style={styles.menuText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
    fontSize: 26,
    textAlign: 'right',
    marginBottom: 25,
    color: '#0F172A',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuContent: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginHorizontal: 8,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Tajawal-Medium',
    fontSize: 17,
    textAlign: 'right',
    color: '#1E293B',
    paddingHorizontal: 8,
  },
});

export default ProfileScreen;
