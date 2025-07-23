import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from './LoadingSpinner';

// AuthGuard: By default, allows public access to all content (requireAuth=false)
// Only blocks access if requireAuth=true is explicitly set
const AuthGuard = ({ 
  children, 
  onUnauthorized, 
  requireAuth = false,  // Default: public access
  showLoading = true
}) => {
  const { user, isLoadingUser } = useAuth();
  const navigation = useNavigation();

  if (isLoadingUser && showLoading) {
    return <LoadingSpinner />;
  }

  // Only block if explicitly required AND user is not authenticated
  if (requireAuth && !user) {
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      navigation.navigate('AuthStack', {
        screen: 'Auth',
        params: {
          message: 'Please sign in to continue',
        },
        initial: false,
      });
    }
    return null;
  }

  // Always show content if auth isn't required
  return children;
};

export default AuthGuard;