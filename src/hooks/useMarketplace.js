import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, engineersAPI, shopsAPI } from '../services/api';
import { showToast } from '../components/common/Toast';

export const useMarketplace = (filters = {}, type = 'all') => {
  const queryClient = useQueryClient();
  const limit = 20;

  const getQueryKey = (dataType) => ['marketplace', dataType, filters];

  // Products Query
  const productsQuery = useInfiniteQuery({
    queryKey: getQueryKey('products'),
    queryFn: ({ pageParam = 1 }) => productsAPI.getProducts({ 
      page: pageParam, 
      limit,
      ...filters,
      type: type === 'all' ? undefined : type
    }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasNextPage) return pages.length + 1;
      return undefined;
    },
    enabled: type === 'all' || type === 'products' || ['solarPanels', 'inverters', 'batteries'].includes(type)
  });

  // Engineers Query
  const engineersQuery = useInfiniteQuery({
    queryKey: getQueryKey('engineers'),
    queryFn: ({ pageParam = 1 }) => engineersAPI.getEngineers({ page: pageParam, limit, ...filters }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasNextPage) return pages.length + 1;
      return undefined;
    },
    enabled: type === 'all' || type === 'engineers'
  });

  // Shops Query
  const shopsQuery = useInfiniteQuery({
    queryKey: getQueryKey('shops'),
    queryFn: ({ pageParam = 1 }) => shopsAPI.getShops({ page: pageParam, limit, ...filters }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasNextPage) return pages.length + 1;
      return undefined;
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

  // Flatten and process data
  const processData = (query) => {
    if (!query.data) return [];
    return query.data.pages.flatMap(page => page.data || []);
  };

  return {
    // Data
    products: processData(productsQuery),
    engineers: processData(engineersQuery),
    shops: processData(shopsQuery),

    // Loading states
    isLoading: productsQuery.isLoading || engineersQuery.isLoading || shopsQuery.isLoading,
    isFetching: productsQuery.isFetching || engineersQuery.isFetching || shopsQuery.isFetching,

    // Error states
    isError: productsQuery.isError || engineersQuery.isError || shopsQuery.isError,
    error: productsQuery.error || engineersQuery.error || shopsQuery.error,

    // Pagination
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

    // Mutations
    likeProduct: likeMutation.mutate,
    unlikeProduct: unlikeMutation.mutate,

    // Refetch
    refetch: () => {
      productsQuery.refetch();
      engineersQuery.refetch();
      shopsQuery.refetch();
    }
  };
}; 