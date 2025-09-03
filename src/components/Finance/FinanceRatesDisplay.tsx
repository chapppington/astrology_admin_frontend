"use client";

import { useFinanceRates } from "../../hooks/use-finance-rates";
import { FinanceRatesButton } from "./FinanceRatesButton";
import { FinanceRatesSheet } from "./FinanceRatesSheet";
import { FinanceRatesInfo } from "./FinanceRatesInfo";

export const FinanceRatesDisplay = () => {
  const { data, isLoading, error } = useFinanceRates();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {/* Mobile: скелетон для кнопки */}
        <div className="xl:hidden">
          <div className="h-6 w-6 bg-muted animate-pulse rounded" />
        </div>

        {/* Desktop: скелетон для курсов */}
        <div className="hidden xl:flex items-center gap-4">
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <FinanceRatesButton disabled />
        <span>TON/USDT: --</span>
        <span>TON/RUB: --</span>
        <span>USDT/RUB: --</span>
        <span>STARS/USDT: --</span>
        <span>STARS/RUB: --</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {/* Mobile: показываем только кнопку */}
      <div className="xl:hidden">
        <FinanceRatesSheet>
          <FinanceRatesButton />
        </FinanceRatesSheet>
      </div>

      {/* Desktop: показываем курсы + кнопку с информацией */}
      <div className="hidden xl:flex items-center gap-4">
        <span>TON/USDT: ${data.ton?.current_price?.toFixed(4) || "--"}</span>
        <span>TON/RUB: ₽{data.tonRub?.toFixed(2) || "--"}</span>
        <span>USDT/RUB: ₽{data.usdtRub?.toFixed(2) || "--"}</span>
        <span>STARS/USDT: ${data.stars.usd.toFixed(3)}</span>
        <span>STARS/RUB: ₽{data.stars.rub.toFixed(3)}</span>

        <FinanceRatesInfo />
      </div>
    </div>
  );
};
