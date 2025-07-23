import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../components/common/Toast';

const BASE_URL = 'http://10.0.2.2:5000'; // Android emulator localhost
// const BASE_URL = 'http://localhost:5000'; // iOS simulator

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data?.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., clear token and redirect to login)
      AsyncStorage.removeItem('token');
      showToast('error', 'Session Expired', 'Please login again');
    } else if (!error.response) {
      // Network error
      showToast('error', 'Network Error', 'Please check your internet connection');
    } else {
      showToast('error', 'Error', message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (phone) => api.post('/auth/register', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify', { phone, otp }),
  updateProfile: (data) => api.patch('/auth/profile', data),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        data[key].forEach((image, index) => {
          formData.append('images', {
            uri: image,
            type: 'image/jpeg',
            name: `image${index}.jpg`
          });
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  likeProduct: (id) => api.post(`/products/${id}/like`),
  unlikeProduct: (id) => api.delete(`/products/${id}/like`),
};

// Engineers API
export const engineersAPI = {
  getEngineers: (params) => api.get('/engineers', { params }),
  getEngineer: (id) => api.get(`/engineers/${id}`),
};

// Shops API
export const shopsAPI = {
  getShops: (params) => api.get('/shops', { params }),
  getShop: (id) => api.get(`/shops/${id}`),
};

// Governorates API
export const governoratesAPI = {
  getGovernorates: () => api.get('/governorates'),
}; 