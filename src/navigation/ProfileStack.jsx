import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// import UpdateProfileScreen from '../screens/profile/UpdateProfileScreen';
import LikedPostsScreen from '../screens/Profile/LikedPostsScreen';
import MyProductsScreen from '../screens/Profile/MyProductsScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
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
        options={{ title: 'الملف الشخصي' }} 
      />
      {/* <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen} 
        options={{ title: 'تعديل الملف' }} 
      /> */}
      <Stack.Screen 
        name="LikedPosts" 
        component={LikedPostsScreen} 
        options={{ title: 'المحفوظات' }} 
      />
 <Stack.Screen 
        name="MyProducts" 
        component={MyProductsScreen} 
        options={{ title: 'منتجاتي' }} 
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;