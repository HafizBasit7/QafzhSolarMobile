import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, engineersAPI, shopsAPI } from '../services/api';
import { showToast } from '../components/common/Toast';
import React, {useState} from 'react'

export const useMarketplace = (filters = {}, type = 'all') => {
  const queryClient = useQueryClient();
  const limit = 10;
  const [activeTab, setActiveTab] = useState('all');

  console.log('[useMarketplace] Initializing with:', { filters, type });

  const processData = (query, dataType) => {
    if (!query.data || !query.data.pages) {
      console.log(`[processData] No data or pages in ${dataType} query:`, query);
      return [];
    }
  
    const data = query.data.pages.flatMap((page) => {
      if (!page) {
        console.log(`[processData] Empty page in ${dataType} response`);
        return [];
      }
  
      // Special handling for products
      if (dataType === 'products') {
        // From your logs, products are in page.data array
        if (Array.isArray(page.data)) {
          console.log(`[processData] Processing ${page.data.length} products from page.data`);
          return page.data;
        }
        // Fallback if structure is different
        if (Array.isArray(page)) {
          console.log(`[processData] Processing ${page.length} products directly from page`);
          return page;
        }
        console.log(`[processData] No products array found in page:`, page);
        return [];
      }
  
      // Existing logic for engineers and shops - KEEP THIS UNCHANGED
      const items = Array.isArray(page)
        ? page
        : Array.isArray(page.data)
        ? page.data
        : [];
  
      if (!Array.isArray(items)) {
        console.error(`[processData] Invalid ${dataType} data format:`, page);
        return [];
      }
  
      console.log(`[processData] Processed ${items.length} ${dataType} items`);
      return items;
    });
  
    console.log(`[processData] Final ${dataType} data:`, data);
    console.log(`[processData] Total ${dataType} processed:`, data.length);
    return data;
  };
  
  

  // 🔹 Products Query
 // In your useMarketplace hook, update the productsQuery to:
const productsQuery = useInfiniteQuery({
  queryKey: ['marketplace', 'products', activeTab, filters],
  queryFn: async ({ pageParam = 1 }) => {
    const params = {
      page: pageParam,
      limit: 10,
      status: 'approved',
      ...(activeTab !== 'all' && { type: activeTab === 'solarPanels' ? 'Panel' : 
                                 activeTab === 'inverters' ? 'Inverter' : 
                                 activeTab === 'batteries' ? 'Battery' : '' }),
      ...filters
    };

    try {
      const response = await productsAPI.getProducts(params);
      console.log('Products API transformed response:', {
        data: response, // Your API returns array directly
        currentPage: pageParam,
        totalPages: Math.ceil(response.total / params.limit), // Adjust based on your API's pagination
        total: response.length
      });
      
      return {
        data: response, // The array of products
        currentPage: pageParam,
        totalPages: 1, // Update this based on your API's actual pagination
        total: response.length
      };
    } catch (error) {
      console.error('Products query error:', error);
      return {
        data: [],
        currentPage: pageParam,
        totalPages: 1,
        total: 0
      };
    }
  },
  getNextPageParam: (lastPage) => {
    return lastPage.currentPage < lastPage.totalPages 
      ? lastPage.currentPage + 1 
      : undefined;
  },
  initialPageParam: 1,
  staleTime: 5 * 60 * 1000,
  enabled: true // Make sure this is always enabled for products
});

  
  // 🔹 Engineers Query
  const engineersQuery = useInfiniteQuery({
    queryKey: ['marketplace', 'engineers', filters, type],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[engineersQuery] Fetching with page:', pageParam);
      
      try {
        const response = await engineersAPI.getEngineers({ 
          page: pageParam, 
          limit,
          ...filters
        });
        console.log('[engineersQuery] API response:', response);
        return response;
      } catch (error) {
        console.error('[engineersQuery] API error:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.currentPage < lastPage?.totalPages 
        ? lastPage.currentPage + 1 
        : undefined;
      console.log('[engineersQuery] Next page param:', nextPage);
      return nextPage;
    },
    enabled: type === 'all' || type === 'engineers',
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.error('[engineersQuery] Query error:', error);
    }
  });

  // 🔹 Shops Query
  const shopsQuery = useInfiniteQuery({
    queryKey: ['marketplace', 'shops', filters, type],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[shopsQuery] Fetching with page:', pageParam);
      
      try {
        const response = await shopsAPI.getShops({ 
          page: pageParam, 
          limit,
          ...filters
        });
        console.log('[shopsQuery] API response:', response);
        return response;
      } catch (error) {
        console.error('[shopsQuery] API error:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.currentPage < lastPage?.totalPages 
        ? lastPage.currentPage + 1 
        : undefined;
      console.log('[shopsQuery] Next page param:', nextPage);
      return nextPage;
    },
    enabled: type === 'all' || type === 'shops',
    initialPageParam: 1,
    onError: (error) => {
      console.error('[shopsQuery] Query error:', error);
    }
  });

  // 🔹 Like Product Mutation
  const likeMutation = useMutation({
    mutationFn: (productId) => {
      console.log('[likeMutation] Liking product:', productId);
      return productsAPI.likeProduct(productId);
    },
    onSuccess: () => {
      console.log('[likeMutation] Successfully liked product');
      queryClient.invalidateQueries(['marketplace', 'products']);
      showToast('success', 'Success', 'Product added to favorites');
    },
    onError: (error) => {
      console.error('[likeMutation] Error:', error);
      showToast('error', 'Error', error.message || 'Failed to like product');
    },
  });

  // 🔹 Unlike Product Mutation
  const unlikeMutation = useMutation({
    mutationFn: (productId) => {
      console.log('[unlikeMutation] Unliking product:', productId);
      return productsAPI.unlikeProduct(productId);
    },
    onSuccess: () => {
      console.log('[unlikeMutation] Successfully unliked product');
      queryClient.invalidateQueries(['marketplace', 'products']);
      showToast('success', 'Success', 'Product removed from favorites');
    },
    onError: (error) => {
      console.error('[unlikeMutation] Error:', error);
      showToast('error', 'Error', error.message || 'Failed to unlike product');
    },
  });

  // Calculate loading states
  const isLoading = productsQuery.isLoading || engineersQuery.isLoading || shopsQuery.isLoading;
  const isError = productsQuery.isError || engineersQuery.isError || shopsQuery.isError;
  const error = productsQuery.error || engineersQuery.error || shopsQuery.error;
  const isFetching = productsQuery.isFetching || engineersQuery.isFetching || shopsQuery.isFetching;

  console.log('[useMarketplace] Loading states:', {
    isLoading,
    isFetching,
    isError,
    error: error?.message
  });

  return {
    products: processData(productsQuery, 'products'),
    engineers: processData(engineersQuery, 'engineers'),
    shops: processData(shopsQuery, 'shops'),
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage: {
      products: productsQuery.hasNextPage,
      engineers: engineersQuery.hasNextPage,
      shops: shopsQuery.hasNextPage,
    },
    fetchNextPage: {
      products: productsQuery.fetchNextPage,
      engineers: engineersQuery.fetchNextPage,
      shops: shopsQuery.fetchNextPage,
    },
    isFetchingNextPage: {
      products: productsQuery.isFetchingNextPage,
      engineers: engineersQuery.isFetchingNextPage,
      shops: shopsQuery.isFetchingNextPage,
    },
    likeProduct: likeMutation.mutate,
    unlikeProduct: unlikeMutation.mutate,
    refetch: () => {
      console.log('[useMarketplace] Refetching all data');
      productsQuery.refetch();
      engineersQuery.refetch();
      shopsQuery.refetch();
    },
  };
};