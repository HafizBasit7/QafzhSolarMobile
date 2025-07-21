import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Dimensions } from 'react-native';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import EngineersScreen from '../screens/EngineersScreen';
import ProductSubmissionScreen from '../screens/ProductSubmissionScreen';
import ar from '../locales/ar';
import AdsScreen from '../screens/AdsScreen';

// Responsive scaling functions
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const scaleSize = (size) => {
  const scaleFactor = isTablet ? 1.3 : isSmallDevice ? 0.9 : 1;
  return size * scaleFactor;
};

const scaleFont = (size) => {
  const scaleFactor = isTablet ? 1.2 : isSmallDevice ? 0.95 : 1;
  return size * scaleFactor;
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'Tajawal-Bold',
          fontSize: scaleFont(12),
          marginBottom: scaleSize(3),
          paddingBottom: scaleSize(2),
        },
        tabBarStyle: {
          paddingTop: scaleSize(5),
          height: scaleSize(isTablet ? 70 : 60) + insets.bottom,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          paddingBottom: insets.bottom > 0 ? insets.bottom - scaleSize(5) : scaleSize(5),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          paddingVertical: scaleSize(4),
        },
        tabBarIconStyle: {
          marginBottom: scaleSize(-2),
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="MarketplaceTab"
        component={MarketplaceScreen}
        options={{
          title: ar.MARKETPLACE.TITLE,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={scaleSize(size)} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="CalculatorTab"
        component={CalculatorScreen}
        options={{
          title: ar.CALCULATOR.TITLE,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "calculator" : "calculator-outline"} 
              size={scaleSize(size)} 
              color={color} 
            />
          ),
        }}
      />
        
      <Tab.Screen
        name="ProductSubmissionTab"
        component={ProductSubmissionScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.addButton,
              focused && styles.addButtonFocused
            ]}>
              <AntDesign 
                name="plus" 
                size={scaleSize(24)} 
                color="#FFFFFF" 
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
        
      <Tab.Screen
        name="EngineersTab"
        component={EngineersScreen}
        options={{
          title: ar.ENGINEERS.TITLE,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={scaleSize(size)} 
              color={color} 
            />
          ),
        }}
      />
        <Tab.Screen
        name="OffersTab"
        component={AdsScreen}
        options={{
          title: 'العروض',
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome 
              name={focused ? "tag" : "tag-o"} 
              size={scaleSize(size)} 
              color={color} 
            />
          ),
        }}
      />
      
        
      <Tab.Screen
        name="ProfileTab"
        component={MarketplaceScreen} // Replace with your Profile screen
        options={{
          title: 'الملف الشخصي',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={scaleSize(size)} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: scaleSize(56),
    height: scaleSize(56),
    borderRadius: scaleSize(28),
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleSize(28),
    borderWidth: scaleSize(3),
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scaleSize(2) },
    shadowOpacity: 0.2,
    shadowRadius: scaleSize(4),
    elevation: 3,
  },
  addButtonFocused: {
    backgroundColor: '#22C55E',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: scaleSize(3) },
    shadowOpacity: 0.3,
    shadowRadius: scaleSize(6),
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
});