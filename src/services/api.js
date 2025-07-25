import axios from 'axios';
import { showToast } from '../components/common/Toast';

const BASE_URL = 'http://192.168.100.26:5005/api/v1'; // OfficeIP

// Create Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Global response handling
api.interceptors.response.use(
  (response) => {
    // Handle paginated responses (products, engineers, shops)
    if (response.data?.data && (response.data?.currentPage || response.data?.pagination)) {
      return {
        data: response.data.data,
        currentPage: response.data.currentPage || response.data.pagination?.currentPage,
        totalPages: response.data.totalPages || response.data.pagination?.totalPages,
        total: response.data.total || response.data.pagination?.total || response.data.data.length
      };
    }
    
    // Handle non-paginated responses with data property
    if (response.data?.data) {
      return {
        data: response.data.data
      };
    }

    // Return raw response for other cases
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      showToast('error', 'Session Expired', 'Please login again');
    } else if (!error.response) {
      showToast('error', 'Network Error', 'Please check your internet connection');
    } else {
      showToast('error', 'Error', message);
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (phone, otp) => api.post(`/auth/verify-otp/${phone}`, { otp }),
  requestOTP: (phone) => api.post('/auth/request-otp', { phone }),
  updateProfile: (data) => api.patch('/auth/profile', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// Products API
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

// Engineers API
export const engineersAPI = {
  getEngineers: (params) => api.get('/marketplace/getAllEngineer', { params }),
  getEngineer: (id) => api.get(`/marketplace/getOneEngineer/${id}`),
  filterEngineers: (params) => api.get('/marketplace/filters-engineer', { params }),
};

// Shops API
export const shopsAPI = {
  getShops: (params) => api.get('/marketplace/getAllShops', { params }),
  getShop: (id) => api.get(`/marketplace/getOneShop/${id}`),
  filterShops: (params) => api.get('/marketplace/filters-shop', { params }),
};

// Governorates API
export const governoratesAPI = {
  getGovernorates: () => api.get('/marketplace/get/governorate-data'),
};
