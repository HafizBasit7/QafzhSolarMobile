import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import TabNavigator from './TabNavigator';
import ProductSubmissionScreen from '../screens/ProductSubmissionScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ShopScreen from '../screens/ShopScreen';
import EngineerScreen from '../screens/EngineerDetailScreen';
import CalculatorResultsScreen from '../screens/CalculatorResultsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import AdBannerScreen from '../screens/AdBannerScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';




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
        name="ProductSubmission"
        component={ProductSubmissionScreen}
        options={{
          title: t('MARKETPLACE.ADD_PRODUCT'),
          headerBackTitle: t('MARKETPLACE.TITLE'),
        }}
      />
      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          title: t('AUTH.VERIFY_PHONE'),
          headerBackTitle: t('MARKETPLACE.ADD_PRODUCT'),
        }}
      />
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EngineerDetail"
        component={EngineerScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: t('CALCULATOR.TITLE'),
          headerBackTitle: t('HOME.TITLE'),
        }}
      />
      <Stack.Screen
        name="CalculatorResults"
        component={CalculatorResultsScreen}
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

<Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}
