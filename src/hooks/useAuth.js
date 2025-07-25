import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { showToast } from '../components/common/Toast';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get user profile
  const { 
    data: user, 
    isLoading: isLoadingUser,
    isError: isUserError,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await authAPI.getProfile();
        return response;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data) => authAPI.register(data),
    onSuccess: () => {
      showToast('success', 'Success', 'Registration successful. Please verify OTP.');
    },
    onError: (error) => {
      showToast('error', 'Error', error.response?.data?.message || 'Registration failed');
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: async ({ phone, otp }) => {
      const response = await authAPI.verifyOTP(phone, otp);
      return response;
    },
    onSuccess: async () => {
      await refetchUser(); // Refresh user data after verification
      showToast('success', 'Success', 'Phone verified successfully');
    },
    onError: (error) => {
      showToast('error', 'Error', error.response?.data?.message || 'Invalid OTP');
    },
  });

  // Request new OTP mutation
  const requestOTPMutation = useMutation({
    mutationFn: (phone) => authAPI.requestOTP(phone),
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
      await authAPI.logout();
      queryClient.clear(); // Clear all queries
      showToast('success', 'Logged out', 'You have been logged out successfully');
    } catch (error) {
      showToast('error', 'Logout Failed', 'Failed to logout');
    }
  };

  // Check auth status
  const checkAuth = async () => {
    try {
      const response = await authAPI.getProfile();
      queryClient.setQueryData(['user'], response);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    user,
    isLoadingUser,
    isUserError,
    isAuthenticated: !!user?.data?.user,
    isVerified: user?.data?.user?.isVerified,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,
    verifyOTP: verifyOTPMutation.mutateAsync,
    isVerifying: verifyOTPMutation.isLoading,
    requestOTP: requestOTPMutation.mutateAsync,
    isRequestingOTP: requestOTPMutation.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isLoading,
    logout,
    checkAuth,
    refetchUser,
  };
};