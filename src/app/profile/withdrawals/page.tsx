import { Metadata } from "next";
import WithdrawalsPartnerTable from "@/components/withdrawals/WithdrawalsPartnerTable";

export const metadata: Metadata = {
  title: "Мои выплаты | Navika Partners",
};

export default function PartnerWithdrawalsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Мои выплаты</h2>
      </div>
      <div className="space-y-4">
        <WithdrawalsPartnerTable />
      </div>
    </div>
  );
}
