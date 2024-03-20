"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

// 扩展 ColumnDef 来添加自定义属性
type MyColumnDef<TData> = ColumnDef<TData> & {
  columnTitle?: string;
};

export type TableData = {
  fileName: string;
  id: number;
  percent: string;
  source: string;
  target: string;
  convertResult: string;
  finalSource: string;
  finalTarget: string;
  finalConvertResult: string;
  isSame: string;
};

export const xliffColumns: MyColumnDef<TableData>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-14 text-xs sm:w-24 xl:w-28 xl:text-sm"
        column={column}
        title="文件名"
      />
    ),
    columnTitle: "文件名",
    cell: (info) => (
      <div className="xl:text-md w-14 overflow-auto text-sm sm:w-24 xl:w-28">
        {info.row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "id",
    columnTitle: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[2rem] text-xs sm:w-fit xl:text-sm"
        column={column}
        title="ID"
      />
    ),
    cell: (info) => (
      <div className="xl:text-md w-[2rem] text-sm sm:w-fit ">
        {info.row.original.id}
      </div>
    ),
    enableGrouping: false,
  },
  {
    accessorKey: "percent",
    columnTitle: "百分比",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="hidden w-[2rem] text-xs sm:inline sm:w-fit xl:text-sm"
        column={column}
        title="百分比"
      />
    ),
    cell: (info) => (
      <div className="xl:text-md hidden w-[2rem] text-sm sm:inline sm:w-fit">
        {info.row.original.percent}
      </div>
    ),
  },
  {
    accessorKey: "isSame",
    columnTitle: "前后相同？",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[2rem] text-xs sm:w-fit xl:text-sm"
        column={column}
        title="前后相同？"
      />
    ),
    cell: (info) => (
      <div className="xl:text-md w-[2rem] text-sm sm:w-fit">
        {info.row.original.isSame}
      </div>
    ),
  },
  {
    accessorKey: "source",
    columnTitle: "原文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[6.5rem] text-xs md:w-[10rem] lg:w-[14rem] xl:w-[18rem] xl:text-sm  2xl:w-[24rem]"
        column={column}
        title="原文"
      />
    ),
    cell: (info) => (
      <div
        className="xl:text-md w-[6.5rem] overflow-auto text-balance text-sm md:w-[10rem] lg:w-[14rem] xl:w-[18rem] 2xl:w-[24rem]"
        dangerouslySetInnerHTML={{ __html: info.row.original.finalSource }}
      ></div>
    ),
    enableGrouping: false,
    getGroupingValue: (row) => row.source,
  },
  {
    accessorKey: "target",
    columnTitle: "译文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[6.5rem] text-xs md:w-[10rem] lg:w-[14rem] xl:w-[18rem] xl:text-sm  2xl:w-[26rem]"
        column={column}
        title="译文"
      />
    ),
    cell: (info) => {
      return (
        <div
          className="xl:text-md w-[6.5rem] overflow-auto text-balance bg-white text-sm delay-150 hover:scale-110 md:w-[10rem] lg:w-[14rem] xl:w-[18rem] 2xl:w-[26rem] dark:bg-[#020817]"
          dangerouslySetInnerHTML={{
            __html: info.row.original.finalTarget,
          }}
        ></div>
      );
    },
    enableGrouping: false,
  },
  {
    accessorKey: "convertResult",
    columnTitle: "转换结果",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[6.5rem] text-xs md:w-[10rem] lg:w-[14rem] xl:w-[18rem] xl:text-sm  2xl:w-[26rem]"
        column={column}
        title="转换结果"
      />
    ),
    cell: (info) => {
      return (
        <div
          className="xl:text-md w-[6.5rem] overflow-auto text-balance bg-white text-sm delay-150 hover:scale-110 md:w-[10rem] lg:w-[14rem] xl:w-[18rem] 2xl:w-[26rem] dark:bg-[#020817]"
          dangerouslySetInnerHTML={{
            __html: info.row.original.finalConvertResult,
          }}
        ></div>
      );
    },
    enableGrouping: false,
  },
];
