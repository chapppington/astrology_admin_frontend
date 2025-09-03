import { Metadata } from "next";
import WithdrawalsDataTable from "@/components/withdrawals/WithdrawalsDataTable";

export const metadata: Metadata = {
  title: "Выплаты | Navika Admin",
};

export default function WithdrawalsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Выплаты</h2>
      </div>
      <div className="space-y-4">
        <WithdrawalsDataTable />
      </div>
    </div>
  );
}
