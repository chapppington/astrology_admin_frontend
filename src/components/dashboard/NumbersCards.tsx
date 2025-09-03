"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/ui/shadcn/card";
import { useDashboardStatistics } from "@/hooks/use-statistics";
import { useFinanceRates } from "@/hooks/use-finance-rates";
import { Star } from "lucide-react";

export function SectionCards() {
  const { data, isLoading, error } = useDashboardStatistics();
  const { data: rates } = useFinanceRates();

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-5 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Общая выручка</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            {isLoading
              ? "..."
              : error
              ? "Ошибка"
              : data
              ? data.total_revenue.toLocaleString()
              : "-"}
            <Star className="h-5 w-5 fill-current" />
            {data && data.total_revenue && rates?.stars.rub && (
              <span className="text-sm text-muted-foreground">
                ≈{" "}
                {(data.total_revenue * rates.stars.rub).toLocaleString("ru-RU")}{" "}
                ₽
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Выплачено партнёрам</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            {isLoading
              ? "..."
              : error
              ? "Ошибка"
              : data
              ? data.total_withdrawn_to_partners.toLocaleString()
              : "-"}
            <Star className="h-5 w-5 fill-current" />
            {data && rates?.stars.rub && (
              <span className="text-sm text-muted-foreground">
                ≈{" "}
                {(
                  data.total_withdrawn_to_partners * rates.stars.rub
                ).toLocaleString("ru-RU")}{" "}
                ₽
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Чистая прибыль</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            {isLoading
              ? "..."
              : error
              ? "Ошибка"
              : data
              ? data.net_profit.toLocaleString()
              : "-"}
            <Star className="h-5 w-5 fill-current" />
            {data && rates?.stars.rub && (
              <span className="text-sm text-muted-foreground">
                ≈ {(data.net_profit * rates.stars.rub).toLocaleString("ru-RU")}{" "}
                ₽
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Новых рег за месяц</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading
              ? "..."
              : error
              ? "Ошибка"
              : data
              ? data.new_users_last_30_days.toLocaleString()
              : "-"}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Всего пользователей</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading
              ? "..."
              : error
              ? "Ошибка"
              : data
              ? data.total_users.toLocaleString()
              : "-"}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
