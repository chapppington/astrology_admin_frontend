"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments.service";

export const usePayments = (
  page = 1,
  pageSize = 20,
  search = "",
  partnerId?: number
) => {
  return useQuery({
    queryKey: ["payments", page, pageSize, search, partnerId ?? null],
    queryFn: () =>
      paymentsService.getPayments(page, pageSize, search, partnerId),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
};
