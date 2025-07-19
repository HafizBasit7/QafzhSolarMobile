import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProductSubmissionScreen from '../screens/ProductSubmissionScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ShopScreen from '../screens/ShopScreen';
import EngineerScreen from '../screens/EngineerDetailScreen';
import CalculatorResultsScreen from '../screens/CalculatorResultsScreen';
import FilterScreen from '../screens/FilterScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import AdBannerScreen from '../screens/AdBannerScreen';
import ar from '../locales/ar';
import ScreenWrapper from '../components/ScreenWrapper'
const Stack = createNativeStackNavigator();


function withScreenWrapper(Component) {
  return (props) => (
    <ScreenWrapper>
      <Component {...props} />
    </ScreenWrapper>
  );
}

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontFamily: 'Tajawal-Bold',
          fontSize: 18,
        },
        headerBackButtonTitle: 'رجوع',
        contentStyle: { backgroundColor: '#f5f5f5' },
        animation: 'slide_from_right',
      }}
    >
      {/* Main Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={withScreenWrapper(TabNavigator)}
        options={{ headerShown: false }}
      />

      {/* Marketplace Flow */}
      <Stack.Screen
        name="ProductDetail"
         component={withScreenWrapper(ProductDetailScreen)}
        options={({ route }) => ({ 
          title: route.params.product.title,
          headerBackTitle: ar.MARKETPLACE.TITLE
        })}
      />
      <Stack.Screen
        name="ProductSubmission"
        component={withScreenWrapper(ProductSubmissionScreen)}
        options={{ 
          title: 'إضافة منتج جديد',
          headerBackTitle: ar.MARKETPLACE.TITLE
        }}
      />
      <Stack.Screen
        name="Verification"
        component={withScreenWrapper(VerificationScreen)}
        options={{ 
          title: 'تأكيد رقم الهاتف',
          headerBackTitle: 'إضافة منتج'
        }}
      />
      <Stack.Screen
        name="Shop"
        component={withScreenWrapper(ShopScreen)}
        options={({ route }) => ({ 
          title: route.params.shop.name,
          headerBackTitle: ar.MARKETPLACE.TITLE
        })}
      />
      <Stack.Screen
        name="Filters"
        component={withScreenWrapper(FilterScreen)}
        options={{ 
          title: 'تصفية النتائج',
          headerBackTitle: ar.MARKETPLACE.TITLE
        }}
      />

      {/* Engineers Flow */}
      <Stack.Screen
        name="EngineerDetail"
        component={withScreenWrapper(EngineerScreen)}
        options={({ route }) => ({ 
          title: route.params.engineer.name,
          headerBackTitle: ar.ENGINEERS.TITLE
        })}
      />

      {/* Calculator Flow */}
      <Stack.Screen
        name="Calculator"
        component={withScreenWrapper(CalculatorScreen)}
        options={{ 
          title: ar.CALCULATOR.TITLE,
          headerBackTitle: 'الرئيسية'
        }}
      />
      <Stack.Screen
        name="CalculatorResults"
        component={withScreenWrapper(CalculatorResultsScreen)}
        options={{ 
          title: 'نتائج الحساب',
          headerBackTitle: ar.CALCULATOR.TITLE
        }}
      />

      {/* Ads Flow */}
      <Stack.Screen
        name="AdBanner"
        component={withScreenWrapper(AdBannerScreen)}
        options={({ route }) => ({ 
          title: route.params.ad?.title || 'عرض إعلاني',
          headerBackTitle: 'رجوع'
        })}
      />
    </Stack.Navigator>
  );
}