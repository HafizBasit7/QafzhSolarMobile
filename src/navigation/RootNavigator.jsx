import { NavigationContainer } from '@react-navigation/native';
import MainStack from './MainStack';
import { createRef } from 'react';
import { StatusBar } from 'react-native';

export const navigationRef = createRef();

export default function RootNavigator() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        StatusBar.setBarStyle('dark-content');
      }}
    >
      <MainStack />
    </NavigationContainer>
  );
}