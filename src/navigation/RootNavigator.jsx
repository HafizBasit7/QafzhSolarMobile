import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { createRef } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';

export const navigationRef = createRef();
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          StatusBar.setBarStyle('light-content');
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainStack" component={MainStack} />
          <Stack.Screen 
            name="AuthStack" 
            component={AuthStack}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}