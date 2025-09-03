"use client";

import { useAdmin } from "@/hooks/use-admin";
import { IAdminProfile, UserRole } from "@/shared/types/auth.types";
import { PaymentsDataTable } from "@/components/dashboard/PaymentsDataTable";

export function PartnerPaymentsClient() {
  const { profileQuery } = useAdmin();
  const data = profileQuery.data as IAdminProfile | undefined;
  const isPartner = data?.role === UserRole.PARTNER;
  const partnerId = isPartner ? data?.id : undefined;

  return (
    <div className="px-4 lg:px-6 space-y-4">
      <h1 className="text-2xl font-semibold">Платежи ваших рефералов</h1>
      {partnerId ? (
        <PaymentsDataTable partnerId={partnerId} />
      ) : (
        <div className="text-sm text-muted-foreground">
          Доступно только для роли партнёра.
        </div>
      )}
    </div>
  );
}
