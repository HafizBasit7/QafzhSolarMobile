import axios from "axios";
import { uploadAPI } from "../utils/imageUpload";
import { showToast } from "../components/common/Toast";
import storage from "../utils/storage";

const BASE_URL = "http://192.168.100.33:5005/api/v1"; // OfficeIP
// const BASE_URL = 'http://192.168.1.6:5005/api/v1'; //HomeIP

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear expired token
        await storage.clearAuthData();
        
        // Redirect to login - you might want to use navigation service here
        // For now, we'll just return the error
        return Promise.reject(error);
      } catch (tokenError) {
        console.error('Error handling token expiration:', tokenError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.',
        type: 'network'
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject({
      ...error.response?.data,
      message: errorMessage,
      status: error.response?.status
    });
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  verifyOTP: (phone, otp) => api.post(`/auth/verify-otp/${phone}`, { otp }),
  requestOTP: (phone) => api.post("/auth/request-otp", { phone }),
  login: async (data) => {
    console.log('API login called with:', data);
    try {
      // Expecting { phone, password }
      const response = await api.post("/auth/login", data);
      console.log('API login response:', response);

      // Backend returns: { status: 200, data: { user: {...}, token: "..." }, message: "..." }
      // Response interceptor returns response.data, so we have: { status: 200, data: { user: {...}, token: "..." }, message: "..." }
      
      // Save token and user data
      if (response?.data?.token) {
        await storage.setToken(response.data.token);
        console.log('Token saved successfully');
      }
      if (response?.data?.user) { 
        await storage.setUserData(response.data.user);
        console.log('User data saved successfully');
      }

      return response;
    } catch (error) {
      console.error('API login error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      // Always clear local storage regardless of API response
      await storage.clearAuthData();
      return response;
    } catch (error) {
      // Clear local storage even if API call fails
      await storage.clearAuthData();
      throw error;
    }
  },
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/update-profile", data),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get("/marketplace/browse-products", { params }),

  // Enhanced search with filters and keywords
  searchProducts: (params) => api.get("/marketplace/search-products", { params }),

  filterProducts: (params) => api.get("/marketplace/filters-product", { params }),

  getProductById: (id) => api.get(`/marketplace/getOneProduct/${id}`),

  createProduct: async (productData) => {
    // Images are already uploaded and URLs are provided in productData.images
    return api.post("/products/post", productData);
  },

  getUserProducts: (userId, params) =>
    api.get(`/products/user-products/${userId}`, { params }),
  updateProduct: (id, data) =>
    api.patch(`/products/update-products${id}`, data),
  deleteProduct: (id) => api.delete(`products/delete-product/${id}`),
  likeProduct: (id) => api.post(`/products/${id}/like`),
  unlikeProduct: (id) => api.delete(`/products/${id}/like`),
};

// Engineers API
export const engineersAPI = {
  getEngineers: (params) => api.get("/marketplace/getAllEngineer", { params }),
  searchEngineers: (params) => api.get("/marketplace/filters-engineer", { params }),
  getEngineerById: (id) => api.get(`/marketplace/getOneEngineer/${id}`),
};

// Shops API
export const shopsAPI = {
  getShops: (params) => api.get("/marketplace/getAllShops", { params }),
  searchShops: (params) => api.get("/marketplace/filters-shop", { params }),
  getShopById: (id) => api.get(`/marketplace/getOneShop/${id}`),
};

// Ads API
export const adsAPI = {
  getAds: (params) => api.get("/marketplace/getAllAds", { params }),
  searchAds: (params) => api.get("/marketplace/filters-ads", { params }),
};

// Governorates API
export const governoratesAPI = {
  getGovernorates: () => api.get("/marketplace/get/governorate-data"),
};

// Unified search API for all content types
export const searchAPI = {
  searchAll: async (params) => {
    const { search_keyword, ...filters } = params;
    
    // If no search keyword, return empty results
    if (!search_keyword?.trim()) {
      return {
        products: { data: [], total: 0 },
        engineers: { data: [], total: 0 },
        shops: { data: [], total: 0 },
        ads: { data: [], total: 0 }
      };
    }

    try {
      // Make parallel requests for all content types
      const [productsRes, engineersRes, shopsRes, adsRes] = await Promise.allSettled([
        productsAPI.searchProducts({ search_keyword, ...filters }),
        engineersAPI.searchEngineers({ search_keyword, ...filters }),
        shopsAPI.searchShops({ search_keyword, ...filters }),
        adsAPI.searchAds({ search_keyword, ...filters })
      ]);

      return {
        products: productsRes.status === 'fulfilled' ? productsRes.value : { data: [], total: 0 },
        engineers: engineersRes.status === 'fulfilled' ? engineersRes.value : { data: [], total: 0 },
        shops: shopsRes.status === 'fulfilled' ? shopsRes.value : { data: [], total: 0 },
        ads: adsRes.status === 'fulfilled' ? adsRes.value : { data: [], total: 0 }
      };
    } catch (error) {
      console.error('Unified search error:', error);
      throw error;
    }
  }
};

export default api;
