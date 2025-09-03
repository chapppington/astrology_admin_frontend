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
import { Badge } from "@/ui/shadcn/badge";
import { useAdmin } from "@/hooks/use-admin";
import PartnersEditPopup from "@/components/partners/PartnersEditPopup";
import { toast } from "@/ui/shadcn/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { CheckIcon, XIcon, Copy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/ui/shadcn/input";
import { useDebounce } from "@/hooks/useDebounce";

export default function PartnersDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);

  const { partners } = useAdmin({
    partnersList: {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: debouncedSearch,
    },
  });

  const data = partners.listQuery.data?.partners || [];
  const total = partners.listQuery.data?.total || 0;
  const pageSize = partners.listQuery.data?.page_size || pagination.pageSize;
  const pageCount = useMemo(
    () => (pageSize ? Math.ceil(total / pageSize) : 0),
    [total, pageSize]
  );

  const handleToggle = useCallback(
    async (id: number) => {
      setTogglingIds((prev) => new Set(prev).add(id));
      try {
        await partners.toggle(id);
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [partners]
  );

  type PartnerRow = {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
    partner_code?: string | null;
    commission_rate?: number | null;
    is_active?: boolean | null;
    ton_wallet_address?: string | null;
    total_referrals?: number | null;
    total_earnings?: number | null;
    referral_balance?: number | null;
  };

  const columns: ColumnDef<PartnerRow>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "username", header: "Логин" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "partner_code",
        header: "Код",
        cell: ({ row }) => row.original.partner_code || "—",
      },
      {
        accessorKey: "commission_rate",
        header: "Комиссия",
        cell: ({ row }) =>
          row.original.commission_rate === undefined ||
          row.original.commission_rate === null
            ? "—"
            : `${row.original.commission_rate}%`,
      },
      {
        accessorKey: "ton_wallet_address",
        header: "TON кошелёк",
        cell: ({ row }) => {
          const full = row.original.ton_wallet_address || "";
          const masked = full ? `${full.slice(0, 4)}…${full.slice(-4)}` : "—";
          const copy = async () => {
            if (!full) return;
            try {
              await navigator.clipboard.writeText(full);
              toast.success("Скопировано", { description: masked });
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
                aria-label="Скопировать TON адрес"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <span className="select-none">{masked}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "total_referrals",
        header: "Рефералов",
        cell: ({ row }) => row.original.total_referrals ?? 0,
      },
      {
        accessorKey: "total_earnings",
        header: "Заработано (звёзды)",
        cell: ({ row }) => row.original.total_earnings ?? 0,
      },
      {
        accessorKey: "referral_balance",
        header: "Баланс (звёзды)",
        cell: ({ row }) => row.original.referral_balance ?? 0,
      },
      {
        accessorKey: "is_active",
        header: "Статус",
        cell: ({ row }) =>
          row.original.is_active ? (
            <Badge variant="default">Активен</Badge>
          ) : (
            <Badge variant="secondary">Неактивен</Badge>
          ),
      },
      {
        id: "actions",
        header: "Действия",
        cell: ({ row }) => {
          const id = row.original.id;
          const busy = togglingIds.has(id);
          return (
            <div className="flex items-center gap-2">
              <PartnersEditPopup
                partnerId={row.original.id}
                username={row.original.username}
                email={row.original.email}
                firstName={row.original.first_name}
                lastName={row.original.last_name}
                bio={row.original.bio}
                partnerCode={row.original.partner_code}
                commissionRate={row.original.commission_rate}
                isActive={row.original.is_active}
                tonWalletAddress={row.original.ton_wallet_address}
              />

              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => handleToggle(id)}
              >
                {busy ? "…" : row.original.is_active ? "Выключить" : "Включить"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Удалить
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-center">
                    Удалить партнёра?
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await partners.delete(id);
                        toast.success("Партнёр удалён", {
                          description: `@${row.original.username}`,
                        });
                      } catch {
                        toast.error("Не удалось удалить", {
                          description: `@${row.original.username}`,
                        });
                      }
                    }}
                    disabled={partners.isDeleting}
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
      },
    ],
    [handleToggle, togglingIds, partners]
  );

  const table = useReactTable({
    data: data as PartnerRow[],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    getRowId: (row) => `${row.id}`,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="w-full">
          <Input
            placeholder="Поиск: логин, email, имя, фамилия, код"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            className="w-full max-w-md"
          />
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
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Загрузка или нет данных
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
              {[10, 20, 30, 40, 50].map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
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
