import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AuthGuard from '../components/common/AuthGuard';

import TabNavigator from './TabNavigator';
import ProductSubmissionScreen from '../screens/ProductSubmissionScreen';
import ShopScreen from '../screens/ShopScreen';
import EngineerScreen from '../screens/EngineerDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

import AdBannerScreen from '../screens/AdBannerScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';
import SolarCalculator from '../screens/SolarCalculator';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontFamily: 'Tajawal-Bold',
          fontSize: 18,
        },
        headerBackButtonTitle: t('COMMON.BACK'),
        contentStyle: { backgroundColor: '#f5f5f5' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Public screens */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params?.product?.name || t('MARKETPLACE.PRODUCT_DETAIL'),
          headerBackTitle: t('MARKETPLACE.TITLE'),
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EngineerDetail"
        component={EngineerScreen}
        options={{ headerShown: false }}
      />

   

      <Stack.Screen
        name="SolarCalculator"
        component={SolarCalculator}
        options={{
          title: t('CALCULATOR.RESULTS'),
          headerBackTitle: t('CALCULATOR.TITLE'),
        }}
      />

      <Stack.Screen
        name="AdBanner"
        component={AdBannerScreen}
        options={({ route }) => ({
          title: route.params?.ad?.title || t('ADS.VIEW_AD'),
          headerBackTitle: t('COMMON.BACK'),
        })}
      />

      {/* Protected screens */}
      <Stack.Screen
        name="ProductSubmission"
        options={{
          title: t('MARKETPLACE.ADD_PRODUCT'),
          headerBackTitle: t('MARKETPLACE.TITLE'),
        }}
      >
        {() => (
          <AuthGuard requireAuth requireVerified>
            <ProductSubmissionScreen />
          </AuthGuard>
        )}
      </Stack.Screen>

      <Stack.Screen 
        name="OTPVerification" 
        component={OTPVerificationScreen} 
      />
    </Stack.Navigator>
  );
}