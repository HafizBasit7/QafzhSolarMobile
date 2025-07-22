import React from 'react';
import { I18nManager, View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import './src/config/i18n'; // ✅ i18n setup
import { StatusBar } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/config/i18n';

// Force RTL for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // Reload might be needed if switching directions mid-app
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
    'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <RootNavigator />
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
