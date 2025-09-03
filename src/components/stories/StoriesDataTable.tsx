"use client";
import * as React from "react";
import { useStories } from "@/hooks/use-stories";
import { Story } from "@/shared/types/stories.types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/table";
import { useDebounce } from "@/hooks/useDebounce";
import StoriesPopup from "@/components/stories/StoriesPopup";
import StoriesEditPopup from "@/components/stories/StoriesEditPopup";
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
import { IconLayoutColumns, IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const storyColumns: ColumnDef<Story>[] = [
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
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original._id}</span>
    ),
  },
  {
    accessorKey: "planet",
    header: "Планета",
    cell: ({ row }) => <Badge variant="outline">{row.original.planet}</Badge>,
  },
  {
    accessorKey: "planet_ru",
    header: "Планета (RU)",
    cell: ({ row }) => <span>{row.original.planet_ru}</span>,
  },
  {
    accessorKey: "element",
    header: "Элемент",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.element}</Badge>
    ),
  },
  {
    accessorKey: "element_ru",
    header: "Элемент (RU)",
    cell: ({ row }) => <span>{row.original.element_ru}</span>,
  },
  {
    accessorKey: "element_type",
    header: "Тип элемента",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.element_type}</Badge>
    ),
  },
  {
    accessorKey: "stories_count",
    header: "Количество историй",
    cell: ({ row }) => (
      <StoriesPopup
        planetRu={row.original.planet_ru}
        elementRu={row.original.element_ru}
        stories={row.original.stories}
      />
    ),
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <StoriesEditPopup
          storyId={row.original._id}
          planetRu={row.original.planet_ru}
          elementRu={row.original.element_ru}
          initialStories={row.original.stories}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

interface StoriesDataTableProps {
  onRefresh?: () => void;
  isBulkUpdating?: boolean;
}

export function StoriesDataTable({
  onRefresh,
  isBulkUpdating,
}: StoriesDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 400);

  const {
    stories,
    pagination: storiesPagination,
    error,
  } = useStories(
    pagination.pageIndex + 1,
    pagination.pageSize,
    debouncedGlobalFilter
  );

  // Сбрасываем пагинацию при изменении поиска
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const table = useReactTable({
    data: stories || [],
    columns: storyColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row._id || `story-${Math.random()}`,
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
    pageCount: storiesPagination?.pages || 0,
  });

  // Убираем блокирующий скелетон: верхняя панель доступна всегда,
  // а скелетоны показываем только вместо строк таблицы ниже

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Ошибка загрузки историй
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="w-full">
          <Input
            placeholder="Поиск по всем полям..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing || !!isBulkUpdating}
              className="flex items-center gap-2"
            >
              <IconRefresh
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing
                ? "Обновление..."
                : isBulkUpdating
                ? "Идёт загрузка"
                : "Обновить"}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
                  colSpan={storyColumns.length}
                  className="h-24 text-center"
                >
                  Нет историй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Выбрано {table.getFilteredSelectedRowModel().rows.length} из{" "}
          {table.getFilteredRowModel().rows.length} строк
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
              <span className="sr-only">На первую страницу</span>«
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">На предыдущую страницу</span>‹
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">На следующую страницу</span>›
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">На последнюю страницу</span>»
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
