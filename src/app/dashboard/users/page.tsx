import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import UsersDataTable from "@/components/users/UsersDataTable";

export const metadata: Metadata = {
  title: "Пользователи | Navika Admin",
};

export default function UsersPage() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Пользователи</h1>
        <p className="text-muted-foreground">Управление статусом и подпиской</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список пользователей</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <UsersDataTable />
        </CardContent>
      </Card>
    </div>
  );
}
