import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { engineersAPI } from '../services/api';

export const useEngineers = (filters = {}) => {
  const shouldUseFilters = !!filters?.search_keyword?.trim();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['engineers', filters],
    queryFn: ({ pageParam = 1 }) =>
      shouldUseFilters
        ? engineersAPI.filterEngineers({ page: pageParam, limit: 10, ...filters })
        : engineersAPI.getEngineers({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    keepPreviousData: true,
  });

  const useEngineer = (id) =>
    useQuery({
      queryKey: ['engineer', id],
      queryFn: () => engineersAPI.getEngineer(id),
      enabled: !!id,
    });

  const getAllEngineers = () =>
    data?.pages?.flatMap((page) => (Array.isArray(page.data) ? page.data : [])) || [];

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
