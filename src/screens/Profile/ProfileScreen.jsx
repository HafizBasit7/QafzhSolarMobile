import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../components/common/Toast';
import { useProducts} from "../../hooks/useProducts"
const ProfileScreen = ({ navigation }) => {
  const { 
    user, 
    isLoadingUser, 
    isUserError, 
    logout, 
    refetchUser 
  } = useAuth();

  const { 
    products: userProducts, 
    isLoading: isLoadingProducts,
    refetch: refetchProducts
  } = useProducts({ user_id: user?.data?.user?._id });

  // Get all liked products (you'll need to implement this in your API)
  const { 
    products: likedProducts,
    isLoading: isLoadingLikes
  } = useProducts({ liked_by: user?.data?.user?._id });


  // const handleLogout = async () => {
  //   try {
  //     await logout();
      
  //     // Reset to RootNavigator → AuthStack → Login
  //     navigation.reset({
  //       index: 0,
  //       routes: [{
  //         name: 'RootNavigator',
  //         state: {
  //           routes: [{ name: 'AuthStack' }], // Forces AuthStack to be active
  //         },
  //       }],
  //     });
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };
  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Loading state
  if (isLoadingUser || isLoadingProducts || isLoadingLikes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  // Error state or unauthenticated
  if (isUserError || !user?.data?.user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Please login to view your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Extract user data from the response structure
  const userData = user.data.user;
  const productCount = userProducts?.length || 0;
  const likedCount = likedProducts?.length || 0;


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: userData.profileImageUrl || 'https://via.placeholder.com/100',
              cache: 'force-cache'
            }} 
            style={styles.avatar} 
            onError={() => console.log("Error loading image")}
          />
          <TouchableOpacity 
            style={styles.editIcon}
            onPress={() => navigation.navigate('UpdateProfile')}
          >
            <Feather name="edit-2" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>
          {userData.name || userData.phone}
        </Text>
        
        {userData.isVerified && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={16} color="#22C55E" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MaterialIcons name="phone" size={16} color="#6e6e6e" />
            <Text style={styles.metaText}>{userData.phone}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <MaterialIcons name="person" size={16} color="#6e6e6e" />
            <Text style={styles.metaText}>{userData.role}</Text>
          </View>
        </View>
        
        <Text style={styles.joinedDate}>
          Member since {new Date(userData.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Stats Section */}
 <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => navigation.navigate('MyProducts')}
        >
          <Text style={styles.statNumber}>{productCount}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => navigation.navigate('LikedPosts')}
        >
          <Text style={styles.statNumber}>{likedCount}</Text>
          <Text style={styles.statLabel}>Liked</Text>
        </TouchableOpacity>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.isVerified ? 'Yes' : 'No'}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MyProducts')}
        >
          <AntDesign name="appstore-o" size={20} color="#22C55E" />
          <Text style={styles.actionButtonText}>My Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('LikedPosts')}
        >
          <AntDesign name="hearto" size={20} color="#22C55E" />
          <Text style={styles.actionButtonText}>Liked Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('UpdateProfile')}
        >
          <Feather name="edit-3" size={20} color="#22C55E" />
          <Text style={styles.actionButtonText}>Update Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
          
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
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
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginText: {
    fontSize: 16,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 14,
    color: '#22C55E',
    marginLeft: 4,
  },
  metaContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6e6e6e',
    marginLeft: 4,
  },
  joinedDate: {
    fontSize: 12,
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
    minWidth: 80,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32325d',
  },
  statLabel: {
    fontSize: 12,
    color: '#6e6e6e',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 16,
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
    color: '#525f7f',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
    borderBottomWidth: 0,
    padding: 12,
  },
  logoutButtonText: {
    color: '#fff',
  },
});

export default ProfileScreen;