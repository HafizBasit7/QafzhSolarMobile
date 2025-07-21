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
// import ScreenWrapper from '../components/ScreenWrapper'
const Stack = createNativeStackNavigator();


// function withScreenWrapper(Component) {
//   return (props) => (
//     <ScreenWrapper>
//       <Component {...props} />
//     </ScreenWrapper>
//   );
// }

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
        component={(TabNavigator)}
        options={{ headerShown: false }}
      />

      {/* Marketplace Flow */}
      <Stack.Screen
        name="ProductDetail"
         component={(ProductDetailScreen)}
        options={({ route }) => ({ 
          title: route.params.product.title,
          headerBackTitle: ar.MARKETPLACE.TITLE,
          headerShown: false
        })}
      />
      <Stack.Screen
        name="ProductSubmission"
        component={(ProductSubmissionScreen)}
        options={{ 
          title: 'إضافة منتج جديد',
          headerBackTitle: ar.MARKETPLACE.TITLE
        }}
      />
      <Stack.Screen
        name="Verification"
        component={(VerificationScreen)}
        options={{ 
          title: 'تأكيد رقم الهاتف',
          headerBackTitle: 'إضافة منتج'
        }}
      />
      <Stack.Screen
        name="Shop"
        component={(ShopScreen)}
        options={({ route }) => ({ 
          // title: route.params.shop.name,
          // headerBackTitle: ar.MARKETPLACE.TITLE
          headerShown: false
        })}
      />
      <Stack.Screen
        name="Filters"
        component={(FilterScreen)}
        options={{ 
          title: 'تصفية النتائج',
          headerBackTitle: ar.MARKETPLACE.TITLE
        }}
      />

      {/* Engineers Flow */}
      <Stack.Screen
        name="EngineerDetail"
        component={(EngineerScreen)}
        options={({ route }) => ({ 
          headerShown: false
          // title: route.params.engineer.name,
      
        })}
      />

      {/* Calculator Flow */}
      <Stack.Screen
        name="Calculator"
        component={(CalculatorScreen)}
        options={{ 
          title: ar.CALCULATOR.TITLE,
          headerBackTitle: 'الرئيسية'
        }}
      />
      <Stack.Screen
        name="CalculatorResults"
        component={(CalculatorResultsScreen)}
        options={{ 
          title: 'نتائج الحساب',
          headerBackTitle: ar.CALCULATOR.TITLE
        }}
      />

      {/* Ads Flow */}
      <Stack.Screen
        name="AdBanner"
        component={(AdBannerScreen)}
        options={({ route }) => ({ 
          title: route.params.ad?.title || 'عرض إعلاني',
          headerBackTitle: 'رجوع'
        })}
      />
    </Stack.Navigator>
  );
}