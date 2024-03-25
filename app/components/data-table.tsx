"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
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
import { ArrowRight, ArrowDown, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showFindAndReplace?: boolean;
  currentDataForm?: "grayed" | "shortened";
  toggleDataForm?: () => void;
  onSearchTextChange?: (text: string) => void;
  onReplaceTextChange?: (text: string) => void;
  onFindAndReplace?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showFindAndReplace,
  currentDataForm,
  toggleDataForm = () => {},
  onSearchTextChange = () => {},
  onReplaceTextChange = () => {},
  onFindAndReplace = () => {},
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    isSame: false,
  });
  const [grouping, setGrouping] = useState<string[]>([]);
  const [minValue, setMinValue] = useState(-1);
  const [maxValue, setMaxValue] = useState(101);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,

    state: {
      columnFilters,
      columnVisibility,
      grouping,
    },
    initialState: {
      pagination: {
        pageSize: 400,
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

  const setMinAndPercentFilter = (minValue: number) => {
    setMinValue(minValue);
    setColumnFilters([
      ...columnFilters,
      {
        id: "percent",
        value: [minValue, maxValue],
      },
    ]);
  };

  const setMaxAndPercentFilter = (maxValue: number) => {
    setMaxValue(maxValue);
    setColumnFilters([
      ...columnFilters,
      {
        id: "percent",
        value: [minValue, maxValue],
      },
    ]);
  };

  const resetPercentFilter = () => {
    setMinValue(-1);
    setMaxValue(101);
    setColumnFilters([
      ...columnFilters,
      {
        id: "percent",
        value: [-1, 101],
      },
    ]);
  };

  return (
    <div className="mt-2 w-auto rounded-md border-none">
      <div className="grid-rows-auto grid-cols-14 sticky top-0 z-40 grid bg-white dark:bg-[#020817]">
        <div className="col-start-1 row-start-1 flex max-h-10 gap-x-1 bg-white dark:bg-[#020817]">
          <Button
            size="lg"
            className="h-[95%] self-center px-1 text-xs sm:text-sm"
            onClick={toggleDataForm}
            disabled={data.length === 0}
          >
            {currentDataForm === "grayed" ? "折叠Tag" : "展开Tag"}
          </Button>
          <Button
            size="lg"
            className="h-[95%] self-center px-1 text-xs sm:text-sm"
            onClick={toggleIsSameColumnFilter}
            disabled={data.length === 0}
          >
            {isFilteringIsSameColumn ? "显示未更改句段" : "隐藏未更改句段"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-[95%] self-center px-1 text-xs sm:text-sm"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            跳到页面顶部
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-[95%] self-center px-1 text-xs sm:text-sm"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
              })
            }
          >
            跳到页面底部
          </Button>
          <DataTableColsVisibility table={table} />
        </div>
        {showFindAndReplace && (
          <div className="col-start-1 row-start-2 ml-1 flex h-8 gap-x-1 sm:col-start-11 sm:row-start-1 sm:h-full">
            <Input
              placeholder="查找内容"
              className="w-[7rem] text-xs sm:w-full sm:text-sm"
              onChange={(event) => onSearchTextChange(event.target.value)}
              disabled={data.length === 0}
            />
            <Input
              placeholder="替换内容"
              className="w-[7rem] text-xs sm:w-full sm:text-sm"
              onChange={(event) => onReplaceTextChange(event.target.value)}
              disabled={data.length === 0}
            />
            <Button
              size="lg"
              className="mx-1 h-[95%] self-center justify-self-start text-xs sm:text-sm"
              onClick={() => onFindAndReplace()}
              disabled={data.length === 0}
            >
              查找替换
            </Button>
          </div>
        )}
      </div>
      <DataTablePagination table={table} />
      <Table>
        <TableHeader className="sticky top-[6.5rem] bg-white sm:top-[4.7rem] dark:bg-[#020817]">
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
                    {header.column.getCanFilter() && (
                      <div className="pt-2">
                        {header.column.id === "percent" ? (
                          <div className="inline-flex">
                            <Input
                              type="text"
                              value={minValue}
                              onChange={(e) => {
                                setMinAndPercentFilter(Number(e.target.value));
                              }}
                              placeholder={`Max`}
                              className="text-tiny h-8 border-none sm:inline xl:text-xs"
                            ></Input>
                            <Input
                              type="text"
                              value={maxValue}
                              onChange={(e) => {
                                setMaxAndPercentFilter(Number(e.target.value));
                              }}
                              placeholder={`Min`}
                              className="text-tiny h-8 border-none sm:inline xl:text-xs"
                            ></Input>
                            <X
                              className="min-w-5 self-center justify-self-start text-red-400"
                              onClick={resetPercentFilter}
                            ></X>
                          </div>
                        ) : (
                          <div className="inline-flex">
                            <Input
                              type="text"
                              value={
                                (header.column.getFilterValue() ?? "") as string
                              }
                              onChange={(event) =>
                                header.column.setFilterValue(event.target.value)
                              }
                              placeholder="搜索"
                              className="hidden h-8 border-none text-xs sm:inline xl:text-sm"
                            />
                            <X
                              className="min-w-5 place-self-center text-red-400"
                              onClick={() =>
                                header.column.setFilterValue(undefined)
                              }
                            ></X>
                          </div>
                        )}
                      </div>
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
                  <TableCell
                    key={cell.id}
                    className={
                      cell.getIsGrouped() ? "bg-teal-600" : "bg-inherit"
                    }
                  >
                    {cell.getIsGrouped() ? (
                      <div className="flex">
                        {row.getIsExpanded() ? (
                          <ArrowDown
                            className="h-4 w-4 hover:scale-125"
                            onClick={() => {
                              row.getToggleExpandedHandler()();
                            }}
                          />
                        ) : (
                          <ArrowRight
                            className="h-4 w-4 hover:scale-125"
                            onClick={() => {
                              row.getToggleExpandedHandler()();
                            }}
                          />
                        )}{" "}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ) : cell.getIsPlaceholder() ? null : (
                      <>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="">
                没有内容
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
