import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import UpdateProfileScreen from '../screens/Profile/UpdateProfileScreen';
import LikedPostsScreen from '../screens/Profile/LikedPostsScreen';
import MyProductsScreen from '../screens/Profile/MyProductsScreen';
import i18n from '../config/i18n';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'right',
        headerTitleStyle: {
          fontFamily: 'Tajawal-Bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: i18n.t('PROFILE.TITLE') }}

      />
      <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen} 
        options={{ title: i18n.t('PROFILE.UPDATE_PROFILE') }} 
      />
      <Stack.Screen 
        name="LikedPosts" 
        component={LikedPostsScreen} 
        options={{ title: i18n.t('PROFILE.LIKED_PRODUCTS') }} 
      />
      <Stack.Screen 
        name="MyProducts" 
        component={MyProductsScreen} 
        options={{ title: i18n.t('PROFILE.MY_PRODUCTS') }} 
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;