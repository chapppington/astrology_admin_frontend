import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import { PaymentsDataTable } from "@/components/dashboard/PaymentsDataTable";

export const metadata: Metadata = {
  title: "Платежи | Navika Admin",
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Платежи</h1>
        <p className="text-muted-foreground">Управление и история платежей</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список платежей</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentsDataTable />
        </CardContent>
      </Card>
    </div>
  );
}
