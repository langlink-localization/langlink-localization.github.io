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
  diffOriginal: JSX.Element[];
  diffModified: JSX.Element[];
  isSame: string;
};

export const xliffColumns: MyColumnDef<TableData>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-32 pl-3 text-sm"
        column={column}
        title="文件名"
      />
    ),
    columnTitle: "文件名",
    cell: (info) => (
      <div className="text-md w-32 overflow-auto pl-3">
        {info.row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "id",
    columnTitle: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-14 pl-3 text-sm"
        column={column}
        title="ID"
      />
    ),
    cell: (info) => (
      <div className="text-md w-14 pl-3">{info.row.original.id}</div>
    ),
  },
  {
    accessorKey: "percent",
    columnTitle: "百分比",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-16 pl-3 text-sm"
        column={column}
        title="百分比"
      />
    ),
    cell: (info) => (
      <div className="text-md w-16 pl-3">{info.row.original.percent}</div>
    ),
  },
  {
    accessorKey: "isSame",
    columnTitle: "前后相同？",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-12 pl-3 text-sm"
        column={column}
        title="前后相同？"
      />
    ),
    cell: (info) => (
      <div className="text-md w-12 pl-3">{info.row.original.isSame}</div>
    ),
  },
  {
    accessorKey: "source",
    columnTitle: "原文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-96 pl-3 text-sm"
        column={column}
        title="原文"
      />
    ),
    cell: (info) => (
      <div className="w-96 overflow-auto text-balance pl-3 text-sm">
        {info.row.original.source}
      </div>
    ),
  },
  {
    accessorKey: "target",
    columnTitle: "译文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[32rem] pl-3 text-sm"
        column={column}
        title="译文"
      />
    ),
    cell: (info) => {
      return (
        <div className="text-md w-[32rem] overflow-auto text-balance pl-3 delay-150 hover:scale-125 hover:bg-[#f8fafc]">
          {info.row.original.diffOriginal}
        </div>
      );
    },
  },
  {
    accessorKey: "convertResult",
    columnTitle: "转换结果",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[32rem] pl-3 text-sm"
        column={column}
        title="转换结果"
      />
    ),
    cell: (info) => {
      return (
        <div className="text-md w-[32rem] overflow-auto text-balance pl-3 delay-150 hover:scale-125 hover:bg-[#f8fafc]">
          {info.row.original.diffModified}
        </div>
      );
    },
  },
];
