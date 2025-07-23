import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { engineersAPI } from '../services/api';

export const useEngineers = (filters = {}) => {
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
    queryKey: ['engineers', filters],
    queryFn: ({ pageParam = 1 }) => engineersAPI.getEngineers({ page: pageParam, ...filters }),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    keepPreviousData: true,
  });

  // Get single engineer
  const useEngineer = (id) => {
    return useQuery({
      queryKey: ['engineer', id],
      queryFn: () => engineersAPI.getEngineer(id),
      enabled: !!id,
    });
  };

  // Helper function to get all engineers from all pages
  const getAllEngineers = () => {
    return data?.pages?.flatMap((page) => page.data) || [];
  };

  return {
    engineers: getAllEngineers(),
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    useEngineer,
  };
}; 