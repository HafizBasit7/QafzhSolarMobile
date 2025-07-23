import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../components/common/Toast';

const BASE_URL = 'http://192.168.1.3:5005/api/v1'; // ✅ Correct base path

// Create Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Attach token dynamically if available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling
api.interceptors.response.use(
  (response) => {
    if (response.data?.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const hadAuthHeader = error.config?.headers?.Authorization;

    if (error.response?.status === 401 && hadAuthHeader) {
      await AsyncStorage.removeItem('token');
      showToast('error', 'Session Expired', 'Please login again');
    } else if (!error.response) {
      showToast('error', 'Network Error', 'Please check your internet connection');
    } else {
      showToast('error', 'Error', message);
    }

    return Promise.reject(error);
  }
);
// ----------------------------
// Auth API
// ----------------------------
export const authAPI = {
  register: (phone) => api.post('/auth/register', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  updateProfile: (data) => api.patch('/auth/profile', data),
  getProfile: () => api.get('/auth/profile'), 
};

// ----------------------------
// Products API (userRoutes)
// ----------------------------
export const productsAPI = {
  getProducts: (params) => api.get('/marketplace/browse-products', { params }),
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
    return api.post('/products/post', formData, {
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

// ----------------------------
// Engineers API (userRoutes)
// ----------------------------
export const engineersAPI = {
  getEngineers: (params) => api.get('/marketplace/getAllEngineer', { params }),
  getEngineer: (id) => api.get(`/marketplace/engineer/${id}`), // Add this
  filterEngineers: (params) => api.get('/marketplace/filters-engineer', { params }),
};

// ----------------------------
// Shops API (userRoutes)
// ----------------------------
export const shopsAPI = {
  getShops: (params) => api.get('/marketplace/getAllShops', { params }),
  getShop: (id) => api.get(`/marketplace/shop/${id}`), // Add this
  filterShops: (params) => api.get('/marketplace/filters-shop', { params }),
};

// ----------------------------
// Governorates API
// ----------------------------
export const governoratesAPI = {
  getGovernorates: () => api.get('/marketplace/get/governorate-data'),
};

// Ads API (optional)
// ----------------------------
// export const adsAPI = {
//   getAds: () => api.get('/ads/getAllAds'),
//   filterAds: (params) => api.get('/marketplace/filters-ads', { params }),
// };
