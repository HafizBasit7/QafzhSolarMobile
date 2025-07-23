import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, engineersAPI, shopsAPI } from '../services/api';
import { showToast } from '../components/common/Toast';

export const useMarketplace = (filters = {}, type = 'all') => {
  const queryClient = useQueryClient();
  const limit = 10;

  // Helper to extract .data from each page (userRoutes.js returns {data: [...]})
  const processData = (query) => {
    if (!query.data || !query.data.pages) return [];
    return query.data.pages.flatMap(page => Array.isArray(page.data) ? page.data : []);
  };

  // Products Query
  const productsQuery = useInfiniteQuery({
    queryKey: ['marketplace', 'products', filters],
    queryFn: ({ pageParam = 1 }) => productsAPI.getProducts({ page: pageParam, limit, ...filters }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    enabled: type === 'all' || type === 'products' || ['solarPanels', 'inverters', 'batteries'].includes(type)
  });

  // Engineers Query
  const engineersQuery = useInfiniteQuery({
    queryKey: ['marketplace', 'engineers', filters],
    queryFn: ({ pageParam = 1 }) => engineersAPI.getEngineers({ page: pageParam, limit, ...filters }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    enabled: type === 'all' || type === 'engineers',
    staleTime: 5 * 60 * 1000
  });

  // Shops Query
  const shopsQuery = useInfiniteQuery({
    queryKey: ['marketplace', 'shops', filters],
    queryFn: ({ pageParam = 1 }) => shopsAPI.getShops({ page: pageParam, limit, ...filters }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    enabled: type === 'all' || type === 'shops'
  });

  // Like/Unlike Product Mutations
  const likeMutation = useMutation({
    mutationFn: (productId) => productsAPI.likeProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries(['marketplace', 'products']);
      showToast('success', 'Success', 'Product added to favorites');
    },
    onError: (error) => {
      showToast('error', 'Error', error.message || 'Failed to like product');
    }
  });

  const unlikeMutation = useMutation({
    mutationFn: (productId) => productsAPI.unlikeProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries(['marketplace', 'products']);
      showToast('success', 'Success', 'Product removed from favorites');
    },
    onError: (error) => {
      showToast('error', 'Error', error.message || 'Failed to unlike product');
    }
  });

  return {
    products: processData(productsQuery),
    engineers: processData(engineersQuery),
    shops: processData(shopsQuery),
    isLoading: productsQuery.isLoading || engineersQuery.isLoading || shopsQuery.isLoading,
    isFetching: productsQuery.isFetching || engineersQuery.isFetching || shopsQuery.isFetching,
    isError: productsQuery.isError || engineersQuery.isError || shopsQuery.isError,
    error: productsQuery.error || engineersQuery.error || shopsQuery.error,
    hasNextPage: {
      products: productsQuery.hasNextPage,
      engineers: engineersQuery.hasNextPage,
      shops: shopsQuery.hasNextPage
    },
    fetchNextPage: {
      products: productsQuery.fetchNextPage,
      engineers: engineersQuery.fetchNextPage,
      shops: shopsQuery.fetchNextPage
    },
    isFetchingNextPage: {
      products: productsQuery.isFetchingNextPage,
      engineers: engineersQuery.isFetchingNextPage,
      shops: shopsQuery.isFetchingNextPage
    },
    likeProduct: likeMutation.mutate,
    unlikeProduct: unlikeMutation.mutate,
    refetch: () => {
      productsQuery.refetch();
      engineersQuery.refetch();
      shopsQuery.refetch();
    }
  };
}; 