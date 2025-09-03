"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/ui/shadcn/card";
import { useAdmin } from "@/hooks/use-admin";
import { PartnerChart } from "@/components/dashboard/PartnerChart";
import { Star } from "lucide-react";
import { useMemo } from "react";
import { IAdminProfile, UserRole } from "@/shared/types/auth.types";
import { useFinanceRates } from "@/hooks/use-finance-rates";

export function ProfilePageClient() {
  const { profileQuery } = useAdmin();
  const { data: rates } = useFinanceRates();
  const data = profileQuery.data as IAdminProfile | undefined;
  const isLoading = profileQuery.isLoading;
  const error = profileQuery.error;

  const totalReferrals: number = data?.total_referrals ?? 0;
  const totalEarnings: number = data?.total_earnings ?? 0; // звезды
  const referralBalance: number = data?.referral_balance ?? 0; // звезды
  const partnerId = useMemo(
    () => (data?.role === UserRole.PARTNER ? data?.id : undefined),
    [data]
  );
  const partnerCode = useMemo(
    () => (data?.role === UserRole.PARTNER ? data?.partner_code : undefined),
    [data]
  );

  const rub = rates?.stars.rub ?? 0;

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Личный кабинет</h1>

        {data?.role === "PARTNER" && (
          <>
            <div className="hidden lg:block">
              <Card className="py-1 px-4 w-fit">
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  ID:{" "}
                  <span className="font-mono text-foreground/90 font-bold">
                    {partnerId}
                  </span>
                  <span className="mx-2 text-foreground/30">•</span>
                  Ваш реферальный код:{" "}
                  <span className="font-mono font-bold text-foreground/90">
                    {partnerCode || "—"}
                  </span>
                </div>
              </Card>
            </div>

            <div className="lg:hidden">
              <Card className="py-3 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      ID партнера:
                    </span>
                    <span className="font-mono text-foreground/90 font-bold text-sm">
                      {partnerId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Реферальный код:
                    </span>
                    <span className="font-mono font-bold text-foreground/90 text-sm">
                      {partnerCode || "—"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Общее число рефералов</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {isLoading
                ? "..."
                : error
                ? "Ошибка"
                : totalReferrals.toLocaleString("ru-RU")}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Всего заработано</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              {isLoading
                ? "..."
                : error
                ? "Ошибка"
                : totalEarnings.toLocaleString("ru-RU")}
              <Star className="h-5 w-5 fill-current" />
              {!isLoading && !error && rub > 0 && (
                <span className="text-sm text-muted-foreground">
                  ≈ {(totalEarnings * rub).toLocaleString("ru-RU")} ₽
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Текущий баланс</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              {isLoading
                ? "..."
                : error
                ? "Ошибка"
                : referralBalance.toLocaleString("ru-RU")}
              <Star className="h-5 w-5 fill-current" />
              {!isLoading && !error && rub > 0 && (
                <span className="text-sm text-muted-foreground">
                  ≈ {(referralBalance * rub).toLocaleString("ru-RU")} ₽
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {data?.role === UserRole.PARTNER && <PartnerChart />}
    </div>
  );
}
