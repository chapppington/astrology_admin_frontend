"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardStatistics } from "@/hooks/use-statistics";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/shadcn/chart";
import { ToggleGroup, ToggleGroupItem } from "@/ui/shadcn/toggle-group";
import { useEffect, useState } from "react";

export const description = "An interactive area chart";

const chartConfig = {
  value: {
    label: "Пользователи",
    // оранжевый
    color: "hsl(27 96% 61%)",
  },
  payments: {
    label: "Платежи",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useDashboardStatistics();
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  let days = 30;
  if (timeRange === "7d") days = 7;
  if (timeRange === "90d") days = 90;

  // Построение объединённого ряда дат (унион), чтобы показывать все дни из обеих серий
  const merged = React.useMemo(() => {
    const usersRaw = data?.users_chart ?? [];
    const paymentsRaw = data?.payments_chart ?? [];
    const lastUsersDate = usersRaw.length
      ? new Date(usersRaw[usersRaw.length - 1].date)
      : undefined;
    const lastPaymentsDate = paymentsRaw.length
      ? new Date(paymentsRaw[paymentsRaw.length - 1].date)
      : undefined;
    const endDate =
      lastUsersDate && lastPaymentsDate
        ? new Date(Math.max(+lastUsersDate, +lastPaymentsDate))
        : lastUsersDate || lastPaymentsDate;
    if (!endDate)
      return [] as { date: string; value: number; payments: number }[];
    const start = new Date(endDate);
    start.setDate(start.getDate() - days + 1);
    const inRange = (d: string) => {
      const dt = new Date(d);
      return dt >= start && dt <= endDate;
    };
    const byDate: Record<
      string,
      { date: string; value: number; payments: number }
    > = {};
    for (const u of usersRaw) {
      if (!inRange(u.date)) continue;
      if (!byDate[u.date])
        byDate[u.date] = { date: u.date, value: 0, payments: 0 };
      byDate[u.date].value = u.value as number;
    }
    for (const p of paymentsRaw) {
      if (!inRange(p.date)) continue;
      if (!byDate[p.date])
        byDate[p.date] = { date: p.date, value: 0, payments: 0 };
      byDate[p.date].payments = p.value as number;
    }
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [data, days]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>График: регистрации и платежи</CardTitle>
        <CardDescription>
          {timeRange === "7d" &&
            "Регистрации и платежи по дням за последние 7 дней"}
          {timeRange === "30d" &&
            "Регистрации и платежи по дням за последние 30 дней"}
          {timeRange === "90d" &&
            "Регистрации и платежи по дням за последние 3 месяца"}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Последние 3 месяца</ToggleGroupItem>
            <ToggleGroupItem value="30d">Последние 30 дней</ToggleGroupItem>
            <ToggleGroupItem value="7d">Последние 7 дней</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={isLoading || error || !data ? [] : merged}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPayments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-payments)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-payments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ru-RU", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Платежи первым — будет сверху в тултипе и легенде */}
            <Area
              dataKey="payments"
              type="natural"
              fill="url(#fillPayments)"
              stroke="var(--color-payments)"
            />
            {/* Пользователи вторым — ниже в тултипе */}
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillUsers)"
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
