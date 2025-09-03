"use client";

import * as React from "react";
import { useUsers } from "@/hooks/use-users";
import { User } from "@/shared/types/users.types";
import { Button } from "@/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import UsersEditPopup from "@/components/users/UsersEditPopup";
import { IconRefresh } from "@tabler/icons-react";
import { toast } from "@/ui/shadcn/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { CheckIcon, XIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useMemo, useState } from "react";

// columns declared inside the component to access handlers

export default function UsersDataTable({ partnerId }: { partnerId?: number }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);

  const {
    users,
    pagination: meta,
    loading,
    error,
    isFetching,
    refetchUsers,
    updateUserAsync,
  } = useUsers(
    pagination.pageIndex + 1,
    pagination.pageSize,
    debouncedSearch,
    partnerId
  );

  const handleExtend30 = useCallback(
    async (telegramUserId: number, currentEnd?: string | null) => {
      setUpdatingIds((prev) => new Set(prev).add(telegramUserId));
      try {
        const now = new Date();
        const current = currentEnd ? new Date(currentEnd) : null;
        const base =
          current && current.getTime() > now.getTime() ? current : now;
        const newEndIso = new Date(
          base.getTime() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();

        const ok = await updateUserAsync({
          telegramUserId,
          data: { subscription_end: newEndIso },
        });
        if (ok) {
          toast.success("Подписка продлена на 30 дней");
        } else {
          toast.error("Не удалось продлить подписку");
        }
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(telegramUserId);
          return next;
        });
      }
    },
    [updateUserAsync]
  );

  const userColumns: ColumnDef<User>[] = useMemo(() => {
    const baseCols: ColumnDef<User>[] = [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "telegram_user_id", header: "TG ID Пользователя" },
      { accessorKey: "first_name", header: "Имя" },
      {
        accessorKey: "username",
        header: "Имя пользователя",
        cell: ({ row }) =>
          row.original.username ? `@${row.original.username}` : "—",
      },
      {
        accessorKey: "partner_id",
        header: "ID Партнера",
        cell: ({ row }) => row.original.partner_id ?? "—",
      },
      {
        accessorKey: "created_at",
        header: "Дата регистрации",
        cell: ({ row }) =>
          row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString("ru-RU")
            : "—",
      },
      { accessorKey: "account_status", header: "Статус" },
      {
        accessorKey: "subscription_end",
        header: "Подписка до (МСК)",
        cell: ({ row }) =>
          row.original.subscription_end
            ? new Date(row.original.subscription_end).toLocaleString("ru-RU", {
                timeZone: "Europe/Moscow",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—",
      },
    ];
    if (!partnerId) {
      baseCols.push({
        id: "actions",
        header: "Действия",
        cell: ({ row }) => {
          const isRowUpdating = updatingIds.has(row.original.telegram_user_id);
          return (
            <div className="flex items-center gap-2">
              <UsersEditPopup
                telegramUserId={row.original.telegram_user_id}
                firstName={row.original.first_name}
                username={row.original.username}
                accountStatus={row.original.account_status}
                subscriptionEnd={row.original.subscription_end}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isRowUpdating}>
                    {isRowUpdating ? "..." : "+30 дней"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-center">
                    Продлить подписку на 30 дней?
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      handleExtend30(
                        row.original.telegram_user_id,
                        row.original.subscription_end
                      )
                    }
                    disabled={isRowUpdating}
                  >
                    <CheckIcon className="size-4" /> Подтвердить
                  </DropdownMenuItem>
                  <DropdownMenuItem data-variant="destructive">
                    <XIcon className="size-4" /> Отмена
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      });
    }
    return baseCols;
  }, [handleExtend30, updatingIds, partnerId]);

  const table = useReactTable({
    data: users || [],
    columns: userColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: meta.pages || 0,
    getRowId: (row) => `${row.telegram_user_id}`,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Ошибка загрузки пользователей
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          className="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Поиск: имя, username, TG ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            setIsRefreshing(true);
            refetchUsers().finally(() => setIsRefreshing(false));
          }}
          disabled={loading || isFetching}
          className="flex items-center gap-2"
        >
          <IconRefresh
            className={`h-4 w-4 ${
              loading || isFetching || isRefreshing ? "animate-spin" : ""
            }`}
          />
          {loading || isFetching || isRefreshing ? "Обновление..." : "Обновить"}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={userColumns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {loading
                    ? "Загрузка..."
                    : search.trim()
                    ? `Ничего не найдено по запросу “${search.trim()}”`
                    : "Нет пользователей"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm font-medium">Строк на странице</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1 text-sm bg-background text-foreground"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Страница {table.getState().pagination.pageIndex + 1} из{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
