import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { showToast } from '../components/common/Toast';

export const useProducts = (filters = {}) => {
  const queryClient = useQueryClient();
  const shouldUseFilters = !!filters?.search_keyword?.trim();

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
      
      const response = shouldUseFilters
        ? await productsAPI.filterProducts(params)
        : await productsAPI.getProducts(params);
      
      // Transform response to match expected structure
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
      showToast('error', 'Creation Failed', error.response?.data?.message || 'Failed to create product');
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
    mutationFn: productsAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Success', 'Product deleted successfully');
    },
    onError: (error) => {
      showToast('error', 'Deletion Failed', error.response?.data?.message || 'Failed to delete product');
    },
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
