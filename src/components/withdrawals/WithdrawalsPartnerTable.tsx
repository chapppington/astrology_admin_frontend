"use client";

import * as React from "react";
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
import {
  IconRefresh,
  IconCopy,
  IconStar,
  IconExternalLink,
} from "@tabler/icons-react";
import { toast } from "@/ui/shadcn/sonner";
import { Badge } from "@/ui/shadcn/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { useWithdrawals } from "@/hooks/use-withdrawals";
import {
  Withdrawal,
  WithdrawalFilterStatus,
} from "@/shared/types/withdrawals.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";

export default function WithdrawalsPartnerTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);

  const [statusFilter, setStatusFilter] =
    useState<WithdrawalFilterStatus>("ALL");

  const { withdrawals, loading, isFetching, refetchWithdrawals } =
    useWithdrawals(
    pagination.pageIndex + 1,
    pagination.pageSize,
    debouncedSearch,
    statusFilter
  );

  const handleRefresh = useCallback(async () => {
    try {
      await refetchWithdrawals();
      toast.success("Данные обновлены");
    } catch {
      toast.error("Ошибка при обновлении данных");
    }
  }, [refetchWithdrawals]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, text: "Ожидает" },
      PROCESSING: { variant: "default" as const, text: "Обрабатывается" },
      COMPLETED: { variant: "success" as const, text: "Завершено" },
      FAILED: { variant: "destructive" as const, text: "Ошибка" },
      CANCELLED: { variant: "destructive" as const, text: "Отменено" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const withdrawalColumns: ColumnDef<Withdrawal>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      {
        accessorKey: "stars_amount",
        header: "Звезды",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.stars_amount.toLocaleString("ru-RU")}
              <IconStar className="inline-block h-3 w-3 text-black fill-current ml-1" />
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.ton_amount.toFixed(9)} TON
            </div>
          </div>
        ),
      },
      {
        accessorKey: "ton_wallet_address",
        header: "TON Кошелек",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() => {
                navigator.clipboard.writeText(row.original.ton_wallet_address);
                toast.success("Адрес скопирован");
              }}
            >
              <IconCopy className="h-3 w-3" />
            </Button>
            <div className="font-mono text-sm">
              {row.original.ton_wallet_address.slice(0, 4)}...
              {row.original.ton_wallet_address.slice(-4)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Статус",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: "ton_transaction_hash",
        header: "TXID",
        cell: ({ row }) => {
          const txid = row.original.ton_transaction_hash;
          const isCompleted = row.original.status === "COMPLETED";
          if (!txid || !isCompleted)
            return <span className="text-muted-foreground">—</span>;
          const masked = `${txid.slice(0, 6)}...${txid.slice(-6)}`;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={() => {
                  navigator.clipboard.writeText(txid);
                  toast.success("TXID скопирован");
                }}
              >
                <IconCopy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={() =>
                  window.open(`https://tonscan.org/tx/${txid}`, "_blank")
                }
                aria-label="Открыть в TONScan"
              >
                <IconExternalLink className="h-3 w-3" />
              </Button>
              <div className="font-mono text-xs">{masked}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Создано",
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          // Конвертируем в московское время (UTC+3)
          const moscowDate = new Date(date.getTime() + 3 * 60 * 60 * 1000);

          return (
            <div className="text-sm">
              {moscowDate.toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              <div className="text-xs text-muted-foreground">
                {moscowDate.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Europe/Moscow",
                })}{" "}
                (MSK)
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: withdrawals,
    columns: withdrawalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid w-full gap-2 sm:flex sm:items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="search" className="hidden sm:inline">
              Поиск:
            </Label>
            <Input
              id="search"
              placeholder="Поиск по адресу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="hidden sm:inline">Статус:</Label>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                if (
                  v === "ALL" ||
                  v === "PENDING" ||
                  v === "PROCESSING" ||
                  v === "COMPLETED" ||
                  v === "FAILED" ||
                  v === "CANCELLED"
                ) {
                  setStatusFilter(v);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все</SelectItem>
                <SelectItem value="PENDING">Ожидает</SelectItem>
                <SelectItem value="PROCESSING">Обрабатывается</SelectItem>
                <SelectItem value="COMPLETED">Завершено</SelectItem>
                <SelectItem value="FAILED">Ошибка</SelectItem>
                <SelectItem value="CANCELLED">Отменено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching}
          className="w-full sm:w-auto"
        >
          <IconRefresh
            className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Обновление..." : "Обновить"}
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  colSpan={withdrawalColumns.length}
                  className="h-24 text-center"
                >
                  {loading
                    ? "Загрузка..."
                    : search.trim()
                    ? `Ничего не найдено по запросу "${search.trim()}"`
                    : "Нет выплат"}
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
