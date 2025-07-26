import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

import MarketplaceScreen from '../screens/MarketplaceScreen';
import SolarCalculator from '../screens/SolarCalculator';
import ProductSubmissionScreen from '../screens/ProductSubmissionScreen';
import AdsScreen from '../screens/AdsScreen';
import ProfileStack from './ProfileStack';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const scaleSize = (size) => {
  const scaleFactor = isTablet ? 1.3 : isSmallDevice ? 0.9 : 0.9;
  return size * scaleFactor;
};

const scaleFont = (size) => {
  const scaleFactor = isTablet ? 1.2 : isSmallDevice ? 0.95 : 0.9;
  return size * scaleFactor;
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const isAuthenticated = !!user?.data?.user;
  const isVerified = user?.data?.user?.isVerified;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'Tajawal-Bold',
          fontSize: scaleFont(11),
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
      {/* Marketplace - Available to all */}
      <Tab.Screen
        name="MarketplaceTab"
        component={MarketplaceScreen}
        options={{
          title: t('MARKETPLACE.TITLE'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={scaleSize(size)}
              color={color}
            />
          ),
        }}
      />

      {/* Calculator - Available to all */}
      <Tab.Screen
        name="SolarCalculator"
        component={SolarCalculator}
        options={{
          title: t('CALCULATOR.TITLE'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calculator' : 'calculator-outline'}
              size={scaleSize(size)}
              color={color}
            />
          ),
        }}
      />

      {/* Product Submission - Only for verified users */}
      <Tab.Screen
        name="ProductSubmissionTab"
        component={ProductSubmissionScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isVerified) {
              e.preventDefault();
              navigation.navigate('AuthStack', {
                screen: 'Login',
                params: {
                  returnScreen: 'ProductSubmission'
                }
              });
            }
          },
        })}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.addButton, focused && styles.addButtonFocused]}>
              <AntDesign name="plus" size={scaleSize(24)} color="#FFFFFF" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      {/* Ads - Available to all */}
      <Tab.Screen
        name="OffersTab"
        component={AdsScreen}
        options={{
          title: t('OFFERS.TITLE'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name="tag"
              size={scaleSize(24)}
              color={color}
            />
          ),
        }}
      />

      {/* Profile - Only for verified users */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              navigation.navigate('AuthStack', {
                screen: 'Login',
                params: {
                  returnScreen: 'Profile'
                }
              });
            }
          },
        })}
        options={{
          title: t('PROFILE.TITLE'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
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