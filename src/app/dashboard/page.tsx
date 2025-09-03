import { Metadata } from "next";
import { ChartAreaInteractive } from "@/components/dashboard/UsersChart";
import { DashboardDataTable } from "@/components/dashboard/DashboardDataTable";
import { SectionCards } from "@/components/dashboard/NumbersCards";

export const metadata: Metadata = {
  title: "Главная | Navika Admin",
};

export default function DashboardPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DashboardDataTable />
    </>
  );
}
