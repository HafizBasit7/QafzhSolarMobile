import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../services/api';

export const useShops = (filters = {}) => {
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
    queryKey: ['shops', filters],
    queryFn: ({ pageParam = 1 }) => shopsAPI.getShops({ page: pageParam, ...filters }),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    keepPreviousData: true,
  });

  // Get single shop
  const useShop = (id) => {
    return useQuery({
      queryKey: ['shop', id],
      queryFn: () => shopsAPI.getShop(id),
      enabled: !!id,
    });
  };

  // Helper function to get all shops from all pages
  const getAllShops = () => {
    return data?.pages?.flatMap((page) => page.data) || [];
  };

  return {
    shops: getAllShops(),
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    useShop,
  };
}; 