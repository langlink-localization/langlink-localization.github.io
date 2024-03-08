"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableColsVisibility } from "@/components/data-table-column-visibility";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    isSame: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 500,
      },
    },
  });

  const isFilteringIsSameColumn = columnFilters.some(
    (filter) => filter.id === "isSame" && filter.value,
  );

  const toggleIsSameColumnFilter = () => {
    if (isFilteringIsSameColumn) {
      setColumnFilters(
        columnFilters.filter((filter) => filter.value !== "不同"),
      );
    } else {
      setColumnFilters([
        ...columnFilters,
        {
          id: "isSame",
          value: "不同",
        },
      ]);
    }
  };

  return (
    <div className="mt-2 w-auto rounded-md border">
      <div className="sticky top-0 z-10 flex justify-between bg-white">
        <Button variant="outline" size="sm" className="h-8 text-xs md:text-sm">
          展开/折叠Tag
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs md:text-sm"
          onClick={toggleIsSameColumnFilter}
        >
          {isFilteringIsSameColumn ? "显示所有句段" : "隐藏未更改句段"}
        </Button>
        <DataTableColsVisibility table={table} />
      </div>
      <DataTablePagination table={table} />
      <Table>
        <TableHeader className="sticky top-20 bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanFilter() ? (
                      <div className="pt-2">
                        <Input
                          type="text"
                          value={
                            (header.column.getFilterValue() ?? "") as string
                          }
                          onChange={(event) =>
                            header.column.setFilterValue(event.target.value)
                          }
                          placeholder="搜索"
                          className="hidden border-none text-xs sm:inline xl:text-sm"
                        />
                      </div>
                    ) : null}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
