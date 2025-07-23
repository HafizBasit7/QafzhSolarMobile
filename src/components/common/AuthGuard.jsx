import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children, returnData }) => {
  const { user, isLoadingUser } = useAuth();
  const navigation = useNavigation();

  if (isLoadingUser) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Navigate to auth screen with return data
    navigation.navigate('AuthStack', {
      screen: 'Auth',
      params: { returnData },
      initial: false,
    });
    return null;
  }

  return children;
};

export default AuthGuard; 