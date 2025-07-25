import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ 
  children, 
  requireAuth = false,
  requireVerified = false,
  showLoading = true
}) => {
  const { user, isLoadingUser } = useAuth();
  const navigation = useNavigation();

  if (isLoadingUser && showLoading) {
    return <LoadingSpinner />;
  }

  // Block if authentication is required and user is not logged in
  if (requireAuth && !user?.data?.user) {
    navigation.navigate('AuthStack', {
      screen: 'Auth',
      params: {
        message: 'Please sign in to continue',
      },
    });
    return null;
  }

  // Block if verification is required and user is not verified
  if (requireVerified && (!user?.data?.user?.isVerified)) {
    navigation.navigate('VerificationStack');
    return null;
  }

  return children;
};

export default AuthGuard;