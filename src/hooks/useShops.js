import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../services/api';

export const useShops = (filters = {}) => {
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
    queryKey: ['shops', filters],
    queryFn: ({ pageParam = 1 }) =>
      shouldUseFilters
        ? shopsAPI.filterShops({ page: pageParam, limit: 10, ...filters })
        : shopsAPI.getShops({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
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

  // Helper: flatten all pages
  const getAllShops = () => {
    return data?.pages?.flatMap((page) => Array.isArray(page.data) ? page.data : []) || [];
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
