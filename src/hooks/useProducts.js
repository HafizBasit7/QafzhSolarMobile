import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { showToast } from '../components/common/Toast';

export const useProducts = (filters = {}) => {
  const queryClient = useQueryClient();
  const shouldUseFilters = !!filters?.search_keyword?.trim();
  const isUserProducts = !!filters?.user_id; // New flag for user products

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
        ...(shouldUseFilters && filters)
      };
      
      // Determine which API endpoint to call based on filters
      let response;
      if (isUserProducts) {
        // Fetch only user's products
        response = await productsAPI.getUserProducts(filters.user_id, params);
      } else if (shouldUseFilters) {
        // Fetch filtered products
        response = await productsAPI.filterProducts(params);
      } else {
        // Fetch all products
        response = await productsAPI.getProducts(params);
      }
      
      return {
        data: response.data, // The array of products
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    keepPreviousData: true,
  });

  // Get single product
  const useProduct = (id) =>
    useQuery({
      queryKey: ['product', id],
      queryFn: async () => {
        const response = await productsAPI.getProduct(id);
        return response.data?.[0] || null; // Return first product or null
      },
      enabled: !!id,
    });

  // Create product
  const createProductMutation = useMutation({
    mutationFn: productsAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Success', 'Product created successfully');
    },
    onError: (error) => {
      console.log('Full error:', error); // Debug
      console.log('Error response:', error.response); // Debug
      
      let errorMessage = 'Failed to create product';
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast('error', 'Creation Failed', errorMessage);
    },
  });

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => productsAPI.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', variables.id]);
      showToast('success', 'Success', 'Product updated successfully');
    },
    onError: (error) => {
      showToast('error', 'Update Failed', error.response?.data?.message || 'Failed to update product');
    },
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      const response = await productsAPI.deleteProduct(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Deleted', 'Product removed successfully');
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Delete error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
  
      const serverMessage = error.response?.data?.msg;
      const errorDetails = error.response?.data?.error;
      
      showToast(
        'error', 
        'Deletion Failed', 
        serverMessage || errorDetails || error.message
      );
    }
  });

  // Like product
  const likeProductMutation = useMutation({
    mutationFn: productsAPI.likeProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['product', id]);
    },
  });

  // Unlike product
  const unlikeProductMutation = useMutation({
    mutationFn: productsAPI.unlikeProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['product', id]);
    },
  });

  // Flatten pages
  const getAllProducts = () =>
    data?.pages?.flatMap((page) => (Array.isArray(page.data) ? page.data : [])) || [];

  return {
    products: getAllProducts(),
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    useProduct,
    createProduct: createProductMutation.mutate,
    isCreating: createProductMutation.isLoading,
    updateProduct: updateProductMutation.mutate,
    isUpdating: updateProductMutation.isLoading,
    deleteProduct: deleteProductMutation.mutate,
    isDeleting: deleteProductMutation.isLoading,
    likeProduct: likeProductMutation.mutate,
    isLiking: likeProductMutation.isLoading,
    unlikeProduct: unlikeProductMutation.mutate,
    isUnliking: unlikeProductMutation.isLoading,
  };
};
