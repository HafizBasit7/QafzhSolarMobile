import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import EngineersScreen from '../screens/EngineersScreen';
// import AdsScreen from '../screens/AdsScreen';
import ar from '../locales/ar';
import ScreenWrapper from '../components/ScreenWrapper'


const Tab = createBottomTabNavigator();

function withScreenWrapper(Component) {
  return (props) => (
    <ScreenWrapper>
      <Component {...props} />
    </ScreenWrapper>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'Tajawal-Bold',
          fontSize: 12,
          marginBottom: 3,
        },
        tabBarStyle: {
          paddingTop: 5,
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="MarketplaceTab"
        component={withScreenWrapper(MarketplaceScreen)}
        options={{
          title: ar.MARKETPLACE.TITLE,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="CalculatorTab"
        component={withScreenWrapper(CalculatorScreen)}
        options={{
          title: ar.CALCULATOR.TITLE,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="EngineersTab"
         component={withScreenWrapper(EngineersScreen)}
        options={{
          title: ar.ENGINEERS.TITLE,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      
      {/* Optional Ads Tab - per client requirements */}
      {/* <Tab.Screen
        name="AdsTab"
        component={AdsScreen}
        options={{
          title: 'العروض والإعلانات',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-offer" size={size} color={color} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}