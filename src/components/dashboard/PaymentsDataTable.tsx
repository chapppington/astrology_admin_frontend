"use client";

import { usePayments } from "@/hooks/use-payments";
import { Payment } from "@/shared/types/payments.types";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Checkbox } from "@/ui/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { Input } from "@/ui/shadcn/input";
import { toast } from "@/ui/shadcn/sonner";
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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { IconLayoutColumns } from "@tabler/icons-react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const paymentColumns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "telegram_user_id",
    header: "TG ID Пользователя",
    cell: ({ row }) => <span>{row.original.telegram_user_id}</span>,
  },
  {
    accessorKey: "telegram_payment_id",
    header: "TG ID Платежа",
    cell: ({ row }) => {
      const full = row.original.telegram_payment_id || "";
      const masked = full ? `${full.slice(0, 4)}…${full.slice(-4)}` : "—";
      const copy = async () => {
        if (!full) return;
        try {
          await navigator.clipboard.writeText(full);
          toast.success("ID платежа скопирован", { description: masked });
        } catch {
          toast.error("Не удалось скопировать");
        }
      };
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={copy}
            aria-label="Скопировать Payment ID"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <span className="select-none">{masked}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "partner_id",
    header: "ID Партнера",
    cell: ({ row }) => <span>{row.original.partner_id ?? "—"}</span>,
  },
  {
    accessorKey: "amount",
    header: "Сумма",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.amount} {row.original.currency}
      </span>
    ),
  },
  {
    accessorKey: "partner_commission_amount",
    header: "Комиссия (звезды)",
    cell: ({ row }) => (
      <span>{row.original.partner_commission_amount ?? 0}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "COMPLETED"
            ? "default"
            : row.original.status === "PENDING"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Описание",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Дата и время создания",
    cell: ({ row }) => {
      const dt = new Date(row.original.created_at);
      const mskDate = dt.toLocaleDateString("ru-RU", {
        timeZone: "Europe/Moscow",
      });
      const mskTime = dt.toLocaleTimeString("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <span>
          {mskDate} · {mskTime} МСК
        </span>
      );
    },
  },
  {
    accessorKey: "used_for_subscription",
    header: "Использован",
    cell: ({ row }) => (
      <Badge
        variant={row.original.used_for_subscription ? "default" : "secondary"}
      >
        {row.original.used_for_subscription ? "Да" : "Нет"}
      </Badge>
    ),
  },
];

export function PaymentsDataTable({ partnerId }: { partnerId?: number }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);
  const { data, isLoading, error } = usePayments(
    pagination.pageIndex + 1,
    pagination.pageSize,
    debouncedSearch,
    partnerId
  );

  const table = useReactTable({
    data: data?.items || [],
    columns: paymentColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: data?.pages || 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Загрузка платежей...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Ошибка загрузки платежей
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Поиск платежей..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            className="w-full max-w-xl"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <IconLayoutColumns className="mr-2 h-4 w-4" />
              Колонки
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  colSpan={paymentColumns.length}
                  className="h-24 text-center"
                >
                  Нет платежей
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Выбрано {table.getFilteredSelectedRowModel().rows.length} из{" "}
          {table.getFilteredRowModel().rows.length} строк(и).
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm font-medium">Строк на странице</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
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
              <span className="sr-only">Перейти на первую страницу</span>«
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Перейти на предыдущую страницу</span>‹
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Перейти на следующую страницу</span>›
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Перейти на последнюю страницу</span>»
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
