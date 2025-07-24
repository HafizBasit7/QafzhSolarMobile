import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../components/common/Toast';

export const useAuth = () => {
  const queryClient = useQueryClient();

    // Add this new mutation for phone check
    const checkPhoneMutation = useMutation({
      mutationFn: (phone) => authAPI.checkPhone(phone),
    });
  
    // Add this helper function
    const checkPhone = async (phone) => {
      try {
        const response = await checkPhoneMutation.mutateAsync(phone);
        return response.exists; // Assuming your backend returns { exists: true/false }
      } catch (error) {
        console.error('Error checking phone:', error);
        return false;
      }
    };

  // Get user profile
  const { 
    data: user, 
    isLoading: isLoadingUser,
    isError: isUserError,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      return authAPI.getProfile();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data, variables) => {
      showToast('success', 'Success', 'OTP sent successfully');
      return variables; // Return phone number for navigation
    },
    onError: (error) => {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to send OTP');
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: ({ phone, otp }) => authAPI.verifyOTP(phone, otp),
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      await refetchUser(); // Immediately refetch user data
      showToast('success', 'Success', 'Verified successfully');
    },
    onError: (error) => {
      showToast('error', 'Error', error.response?.data?.message || 'Invalid OTP');
    },
  });

  // Request new OTP mutation
  const requestOTPMutation = useMutation({
    mutationFn: authAPI.requestOTP,
    onSuccess: () => {
      showToast('success', 'Success', 'New OTP sent successfully');
    },
    onError: (error) => {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to resend OTP');
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      showToast('success', 'Success', 'Profile updated successfully');
    },
    onError: (error) => {
      showToast('error', 'Update Failed', error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      queryClient.removeQueries(); // Clear all queries
      showToast('success', 'Logged out', 'You have been logged out successfully');
    } catch (error) {
      showToast('error', 'Logout Failed', 'Failed to logout');
    }
  };

  return {
    user,
    isLoadingUser,
    isUserError,
    isAuthenticated: !!user,
    register: registerMutation.mutateAsync, // Using mutateAsync for better promise handling
    isRegistering: registerMutation.isLoading,
    verifyOTP: verifyOTPMutation.mutateAsync,
    isVerifying: verifyOTPMutation.isLoading,
    requestOTP: requestOTPMutation.mutateAsync,
    isRequestingOTP: requestOTPMutation.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isLoading, checkPhone,
    isCheckingPhone: checkPhoneMutation.isLoading,
    logout,
  };
}; 