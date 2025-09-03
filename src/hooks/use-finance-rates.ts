import { useQuery } from "@tanstack/react-query";
import {
  financeRatesService,
  type FinanceRates,
} from "../services/finance-rates.service";

export const useFinanceRates = () => {
  return useQuery<FinanceRates>({
    queryKey: ["finance-rates"],
    queryFn: () => financeRatesService.getFinanceRates(),
    refetchInterval: 120000, // Обновляем каждые 2 минуты
    staleTime: 120000, // Данные считаются свежими 2 минуты
    gcTime: 600000, // Храним в кеше 10 минут
    
  });
};
