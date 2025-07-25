import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createRef, useEffect, useState } from 'react';
import { StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { useAuth } from '../hooks/useAuth';

export const navigationRef = createRef();
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, checkAuth } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await checkAuth(); // This will verify auth state via cookies
      } finally {
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  if (!isReady) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  const isAuthenticated = !!user?.data?.user;
  const isVerified = user?.data?.user?.isVerified;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          StatusBar.setBarStyle('light-content');
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Main stack always accessible */}
          <Stack.Screen name="MainStack" component={MainStack} />
          
          {/* Auth stacks */}
          <Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
            {!isAuthenticated && (
              <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
            
            {isAuthenticated && !isVerified && (
              <Stack.Screen name="VerificationStack" component={AuthStack} />
            )}
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}