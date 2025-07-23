// ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import i18n from '../../config/i18n';
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfileScreen = ({ navigation }) => {
  const { user, isLoadingUser, logout } = useAuth();

  if (isLoadingUser) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Please login to view your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('AuthStack', { screen: 'Auth' })}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: user.profileImageUrl || 'https://via.placeholder.com/100' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity 
            style={styles.editIcon}
            onPress={() => navigation.navigate('UpdateProfile')}
          >
            <Feather name="edit-2" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user.name || 'Update your profile'}</Text>
        
        <View style={styles.locationContainer}>
          <MaterialIcons name="phone" size={16} color="#6e6e6e" />
          <Text style={styles.userLocation}>{user.phone}</Text>
        </View>
        
        <Text style={styles.joinedDate}>
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.products?.length || 0}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.likedProducts?.length || 0}</Text>
          <Text style={styles.statLabel}>Liked</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MyProducts')}
        >
          <AntDesign name="appstore-o" size={20} color="#22C55E" />
          <Text style={styles.actionButtonText}>{i18n.t('PROFILE.MY_PRODUCTS')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('LikedPosts')}
        >
          <AntDesign name="hearto" size={20} color="#22C55E" />
          <Text style={styles.actionButtonText}>{i18n.t('PROFILE.LIKED_PRODUCTS')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('UpdateProfile')}
        >
          <Feather name="edit-3" size={20} color="#22C55E" />
          <Text style={styles.actionButtonText}>{i18n.t('PROFILE.UPDATE_PROFILE')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.settingsButton]}
          onPress={logout}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={[styles.actionButtonText, styles.settingsButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#525f7f',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Tajawal-Bold',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f0f2f5',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22C55E',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Tajawal-Bold',
    color: '#32325d',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 13,
    fontFamily: 'Tajawal-Regular',
    color: '#6e6e6e',
    marginLeft: 4,
  },
  joinedDate: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#adb5bd',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#32325d',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal-Regular',
    color: '#6e6e6e',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#525f7f',
    marginLeft: 12,
  },
  settingsButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
    borderBottomWidth: 0,
    padding: 12,
  },
  settingsButtonText: {
    color: '#fff',
  },
});

export default ProfileScreen;