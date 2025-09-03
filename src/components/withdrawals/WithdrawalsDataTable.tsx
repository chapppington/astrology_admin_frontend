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
  IconPlus,
  IconStar,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";
import { toast } from "@/ui/shadcn/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { Badge } from "@/ui/shadcn/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { WithdrawalsCreatePopup } from "./WithdrawalsCreatePopup";
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
import { ProcessWithdrawalDialog } from "./ProcessWithdrawalDialog";

export default function WithdrawalsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] =
    useState<Withdrawal | null>(null);
  const debouncedSearch = useDebounce(search.trim(), 400);

  const [statusFilter, setStatusFilter] =
    useState<WithdrawalFilterStatus>("ALL");

  const {
    withdrawals,
    isFetching,
    refetchWithdrawals,
    createWithdrawalAsync,
    cancelWithdrawalAsync,
  } = useWithdrawals(
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
        accessorKey: "partner_name",
        header: "Партнер",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.partner_name ||
                `Партнер #${row.original.partner_id}`}
            </div>
            <div className="text-sm text-muted-foreground">
              ID: {row.original.partner_id}
              {row.original.partner_code && (
                <span className="ml-2">| Код: {row.original.partner_code}</span>
              )}
            </div>
          </div>
        ),
      },
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
      {
        id: "actions",
        header: "Действия",
        cell: ({ row }) => {
          const isPending = row.original.status === "PENDING";
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Открыть меню</span>
                  <IconRefresh className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isPending && (
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await cancelWithdrawalAsync(row.original.id);
                        toast.success("Выплата отменена");
                      } catch {
                        toast.error("Не удалось отменить выплату");
                      }
                    }}
                  >
                    Отменить выплату
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setProcessingWithdrawal(row.original)}
                >
                  Обработать
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [setProcessingWithdrawal, cancelWithdrawalAsync]
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
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid w-full gap-2 xl:flex xl:items-center">
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <Label htmlFor="search" className="hidden xl:inline">
              Поиск:
            </Label>
            <Input
              id="search"
              placeholder="Поиск по партнеру, адресу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full xl:w-64"
            />
          </div>
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <Label className="hidden xl:inline">Статус:</Label>
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
              <SelectTrigger className="w-full xl:w-40">
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
        <div className="w-full xl:w-auto grid grid-cols-1 gap-2 xl:flex xl:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="w-full xl:w-auto"
          >
            <IconRefresh
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Обновление..." : "Обновить"}
          </Button>
          <Button
            onClick={() => setShowCreatePopup(true)}
            className="w-full xl:w-auto"
            size="sm"
          >
            Создать выплату
          </Button>
        </div>
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
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 xl:flex">
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
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 xl:flex"
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
              className="hidden size-8 xl:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </Button>
          </div>
        </div>
      </div>

      {showCreatePopup && (
        <WithdrawalsCreatePopup
          onClose={() => setShowCreatePopup(false)}
          onSuccess={async (withdrawalData) => {
            try {
              await createWithdrawalAsync(withdrawalData);
              setShowCreatePopup(false);
              toast.success("Выплата создана");
            } catch {
              toast.error("Ошибка при создании выплаты");
            }
          }}
        />
      )}

      {processingWithdrawal && (
        <ProcessWithdrawalDialog
          withdrawal={processingWithdrawal}
          onClose={() => setProcessingWithdrawal(null)}
          onSaved={() => {
            setProcessingWithdrawal(null);
            refetchWithdrawals();
          }}
        />
      )}
    </div>
  );
}
