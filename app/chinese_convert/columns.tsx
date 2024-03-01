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
        className="w-2/21 pl-3 text-sm"
        column={column}
        title="文件名"
      />
    ),
    columnTitle: "文件名",
    cell: (info) => (
      <div className="w-2/21 text-md overflow-auto pl-3">
        {info.row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "id",
    columnTitle: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-1/21 pl-3 text-sm"
        column={column}
        title="ID"
      />
    ),
    cell: (info) => (
      <div className="w-1/21 text-md pl-3">{info.row.original.id}</div>
    ),
  },
  {
    accessorKey: "percent",
    columnTitle: "百分比",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-1/21 pl-3 text-sm"
        column={column}
        title="百分比"
      />
    ),
    cell: (info) => (
      <div className="w-1/21 text-md pl-3">{info.row.original.percent}</div>
    ),
  },
  {
    accessorKey: "isSame",
    columnTitle: "前后相同？",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-1/21 pl-3 text-sm"
        column={column}
        title="前后相同？"
      />
    ),
    cell: (info) => (
      <div className="w-1/21 text-md pl-3">{info.row.original.isSame}</div>
    ),
  },
  {
    accessorKey: "source",
    columnTitle: "原文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-4/21 pl-3 text-sm"
        column={column}
        title="原文"
      />
    ),
    cell: (info) => (
      <div className="w-4/21 overflow-auto text-balance pl-3 text-sm">
        {info.row.original.source}
      </div>
    ),
  },
  {
    accessorKey: "target",
    columnTitle: "译文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-6/21 pl-3 text-sm"
        column={column}
        title="译文"
      />
    ),
    cell: (info) => {
      return (
        <div className="w-6/21 text-md overflow-auto text-balance pl-3 hover:scale-125">
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
        className="w-6/21 pl-3 text-sm"
        column={column}
        title="转换结果"
      />
    ),
    cell: (info) => {
      return (
        <div className="w-6/21 text-md overflow-auto text-balance pl-3 hover:scale-125">
          {info.row.original.diffModified}
        </div>
      );
    },
  },
];
