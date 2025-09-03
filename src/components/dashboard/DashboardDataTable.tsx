"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/tabs";
import UsersDataTable from "@/components/users/UsersDataTable";
import { PaymentsDataTable } from "@/components/dashboard/PaymentsDataTable";

export function DashboardDataTable() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="payments">Платежи</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="users" className="px-4 lg:px-6">
        <UsersDataTable />
      </TabsContent>
      <TabsContent value="payments" className="px-4 lg:px-6">
        <PaymentsDataTable />
      </TabsContent>
    </Tabs>
  );
}
