"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withdrawalsService } from "@/services/withdrawals.service";
import {
  Withdrawal,
  WithdrawalRequest,
  WithdrawalEditableStatus,
  WithdrawalFilterStatus,
} from "@/shared/types/withdrawals.types";

export const useWithdrawals = (
  page = 1,
  pageSize = 20,
  search = "",
  status?: WithdrawalFilterStatus
) => {
  const queryClient = useQueryClient();

  const withdrawalsQuery = useQuery({
    queryKey: ["withdrawals", page, pageSize, search, status ?? "ALL"],
    queryFn: () =>
      withdrawalsService.getWithdrawals(page, pageSize, search, status),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (prev) => prev,
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: (withdrawalData: WithdrawalRequest) =>
      withdrawalsService.createWithdrawal(withdrawalData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["withdrawals"],
        exact: false,
      });
    },
  });

  const updateWithdrawalStatusMutation = useMutation<
    Withdrawal,
    unknown,
    {
      withdrawalId: number;
      status: WithdrawalEditableStatus;
      transactionHash?: string;
      errorMessage?: string;
    }
  >({
    mutationFn: ({ withdrawalId, status, transactionHash, errorMessage }) =>
      withdrawalsService.updateWithdrawalStatus(
        withdrawalId,
        status,
        transactionHash,
        errorMessage
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["withdrawals"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-statistics"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["partner-statistics"],
        exact: false,
      });
    },
  });

  const cancelWithdrawalMutation = useMutation({
    mutationFn: (withdrawalId: number) =>
      withdrawalsService.cancelWithdrawal(withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["withdrawals"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-statistics"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["partner-statistics"],
        exact: false,
      });
    },
  });

  return {
    withdrawals: withdrawalsQuery.data?.items || [],
    pagination: {
      total: withdrawalsQuery.data?.total || 0,
      page: withdrawalsQuery.data?.page || 1,
      page_size: withdrawalsQuery.data?.page_size || 20,
      pages: withdrawalsQuery.data?.pages || 0,
    },
    loading: withdrawalsQuery.isLoading,
    error: withdrawalsQuery.error,
    isFetching: withdrawalsQuery.isFetching,
    isRefetching: withdrawalsQuery.isRefetching,
    refetchWithdrawals: withdrawalsQuery.refetch,

    createWithdrawal: createWithdrawalMutation.mutate,
    createWithdrawalAsync: createWithdrawalMutation.mutateAsync,
    createWithdrawalLoading: createWithdrawalMutation.isPending,

    updateWithdrawalStatus: updateWithdrawalStatusMutation.mutate,
    updateWithdrawalStatusAsync: updateWithdrawalStatusMutation.mutateAsync,
    updateWithdrawalStatusLoading: updateWithdrawalStatusMutation.isPending,

    cancelWithdrawal: cancelWithdrawalMutation.mutate,
    cancelWithdrawalAsync: cancelWithdrawalMutation.mutateAsync,
    cancelWithdrawalLoading: cancelWithdrawalMutation.isPending,
  };
};
