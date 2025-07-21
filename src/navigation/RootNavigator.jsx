import { NavigationContainer } from '@react-navigation/native';
import MainStack from './MainStack';
import { createRef } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';

export const navigationRef = createRef();

export default function RootNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        StatusBar.setBarStyle('light-content');
      }}
    >
      <MainStack />
    </NavigationContainer>
    </SafeAreaView>
  );
}