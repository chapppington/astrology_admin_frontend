"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/services/statistics.service";

export const useDashboardStatistics = () => {
  return useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: () => statisticsService.getDashboardStatistics(),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
};

export const usePartnerStatistics = () => {
  return useQuery({
    queryKey: ["partner-statistics"],
    queryFn: () => statisticsService.getPartnerStatistics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
