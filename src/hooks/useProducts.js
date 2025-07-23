import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { showToast } from '../components/common/Toast';

export const useProducts = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get products with infinite scroll
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
    queryFn: ({ pageParam = 1 }) => productsAPI.getProducts({ page: pageParam, limit: 10, ...filters }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    keepPreviousData: true,
  });

  // Get single product
  const useProduct = (id) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: () => productsAPI.getProduct(id),
      enabled: !!id,
    });
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productsAPI.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Success', 'Product created successfully');
    },
    onError: (error) => {
      showToast('error', 'Creation Failed', error.response?.data?.message || 'Failed to create product');
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => productsAPI.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', data.id]);
      showToast('success', 'Success', 'Product updated successfully');
    },
    onError: (error) => {
      showToast('error', 'Update Failed', error.response?.data?.message || 'Failed to update product');
    },
  });

  // Delete product mutation
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

  // Like/Unlike product mutations
  const likeProductMutation = useMutation({
    mutationFn: productsAPI.likeProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['product', data.id]);
    },
  });

  const unlikeProductMutation = useMutation({
    mutationFn: productsAPI.unlikeProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['product', data.id]);
    },
  });

  // Helper function to get all products from all pages
  const getAllProducts = () => {
    return data?.pages?.flatMap((page) => Array.isArray(page.data) ? page.data : []) || [];
  };

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