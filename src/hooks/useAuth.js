import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../components/common/Toast';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get user profile
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getProfile,
    enabled: !!AsyncStorage.getItem('token'),
    retry: false,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      showToast('success', 'Success', 'OTP sent successfully');
    },
    onError: (error) => {
      showToast('error', 'Registration Failed', error.response?.data?.message || 'Something went wrong');
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: authAPI.verifyOTP,
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      queryClient.invalidateQueries(['user']);
      showToast('success', 'Success', 'Phone number verified successfully');
    },
    onError: (error) => {
      showToast('error', 'Verification Failed', error.response?.data?.message || 'Invalid OTP');
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
    await AsyncStorage.removeItem('token');
    queryClient.clear();
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isLoading,
    verifyOTP: verifyOTPMutation.mutate,
    isVerifying: verifyOTPMutation.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isLoading,
    logout,
  };
}; 