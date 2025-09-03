"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";

export const useUsers = (
  page = 1,
  pageSize = 20,
  search = "",
  partnerId?: number
) => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users", page, pageSize, search, partnerId ?? null],
    queryFn: () => usersService.getUsers(page, pageSize, search, partnerId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      telegramUserId,
      data,
    }: {
      telegramUserId: number;
      data: Partial<{
        account_status: "BASIC" | "PREMIUM";
        subscription_end: string | null;
        subscription_start?: string | null;
      }>;
    }) => usersService.updateUser(telegramUserId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data?.items || [],
    pagination: {
      total: usersQuery.data?.total || 0,
      page: usersQuery.data?.page || 1,
      page_size: usersQuery.data?.page_size || 20,
      pages: usersQuery.data?.pages || 0,
    },
    loading: usersQuery.isLoading,
    error: usersQuery.error,
    isFetching: usersQuery.isFetching,
    isRefetching: usersQuery.isRefetching,
    refetchUsers: usersQuery.refetch,

    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    updateUserLoading: updateUserMutation.isPending,
  };
};
