import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import PartnersDataTable from "@/components/partners/PartnersDataTable";
import PartnersCreatePopup from "@/components/partners/PartnersCreatePopup";

export const metadata: Metadata = {
  title: "Партнеры | Navika Admin",
};

export default function PartnersPage() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Партнеры</h1>
        <p className="text-muted-foreground">
          Управление партнерами и статусами
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Список партнеров</CardTitle>
            <PartnersCreatePopup />
          </div>
        </CardHeader>
        <CardContent>
          <PartnersDataTable />
        </CardContent>
      </Card>
    </div>
  );
}
