import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { useModal } from './useModal';

export const useProducts = (filters = {}) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useModal();
  const { search_keyword, ...otherFilters } = filters;
  const shouldUseSearch = !!search_keyword?.trim();
  const isUserProducts = !!filters?.user_id; // Flag for user products

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { 
        page: pageParam, 
        limit: 10,
        ...filters
      };
      
      // Determine which API endpoint to call based on filters
      let response;
      if (isUserProducts) {
        // Fetch only user's products
        response = await productsAPI.getUserProducts(filters.user_id, params);
      } else if (shouldUseSearch || Object.keys(otherFilters).length > 0) {
        // Use enhanced search when there's a search keyword or other filters
        response = await productsAPI.searchProducts(params);
      } else {
        // Fetch all products when no filters
        response = await productsAPI.getProducts(params);
      }
      
      return {
        data: response.data || [], // The array of products
        currentPage: response.currentPage || pageParam,
        totalPages: response.totalPages || 1,
        total: response.total || 0
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  // Flatten the data from infinite query
  const products = data?.pages?.flatMap(page => page.data) || [];
  const totalCount = data?.pages?.[0]?.total || 0;

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productsAPI.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products']);
      showSuccess('تم النشر بنجاح!', 'تم نشر منتجك بنجاح وهو متاح الآن للمشاهدة');
    },
    onError: (error) => {
      showError('فشل النشر', error.message || 'فشل في نشر المنتج، تحقق من البيانات وأعد المحاولة');
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: productsAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showSuccess('تم الحذف', 'تم حذف المنتج بنجاح');
    },
    onError: (error) => {
      showError('فشل الحذف', error.message || 'فشل في حذف المنتج');
    },
  });

  return {
    products,
    totalCount,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    
    // Mutations
    createProduct: createProductMutation.mutate,
    isCreating: createProductMutation.isLoading,
    deleteProduct: deleteProductMutation.mutate,
    isDeleting: deleteProductMutation.isLoading,
  };
};

// Hook for single product
export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.getProductById(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
