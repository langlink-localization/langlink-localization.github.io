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
        className="w-16 pl-3 text-xs xl:w-28 xl:text-sm"
        column={column}
        title="文件名"
      />
    ),
    columnTitle: "文件名",
    cell: (info) => (
      <div className="xl:text-md w-16 overflow-auto pl-3 text-sm xl:w-28">
        {info.row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "id",
    columnTitle: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-12 pl-3 text-xs xl:w-14 xl:text-sm"
        column={column}
        title="ID"
      />
    ),
    cell: (info) => (
      <div className="xl:text-md w-12 pl-3 text-sm xl:w-14">
        {info.row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "percent",
    columnTitle: "百分比",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-14 pl-3 text-xs xl:w-16 xl:text-sm"
        column={column}
        title="百分比"
      />
    ),
    cell: (info) => (
      <div className="xl:text-md w-14 pl-3 text-sm xl:w-16">
        {info.row.original.percent}
      </div>
    ),
  },
  {
    accessorKey: "isSame",
    columnTitle: "前后相同？",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-10 pl-3 text-xs xl:w-12 xl:text-sm"
        column={column}
        title="前后相同？"
      />
    ),
    cell: (info) => (
      <div className="xl:text-md w-10 pl-3 text-sm xl:w-12">
        {info.row.original.isSame}
      </div>
    ),
  },
  {
    accessorKey: "source",
    columnTitle: "原文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="xl:wl-80 w-40 pl-3 text-xs xl:text-sm"
        column={column}
        title="原文"
      />
    ),
    cell: (info) => (
      <div className="xl:wl-80 xl:text-md w-40 overflow-auto text-balance pl-3 text-sm">
        {info.row.original.source}
      </div>
    ),
  },
  {
    accessorKey: "target",
    columnTitle: "译文",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-[15rem] pl-3 text-xs xl:w-[30rem] xl:text-sm"
        column={column}
        title="译文"
      />
    ),
    cell: (info) => {
      return (
        <div className="xl:text-md w-[15rem] overflow-auto text-balance bg-white pl-3 text-sm delay-150 hover:scale-125 xl:w-[30rem]">
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
        className="w-[15rem] pl-3 text-xs xl:w-[30rem] xl:text-sm"
        column={column}
        title="转换结果"
      />
    ),
    cell: (info) => {
      return (
        <div className="xl:text-md w-[15rem] overflow-auto text-balance bg-white pl-3 text-sm delay-150 hover:scale-125 xl:w-[30rem]">
          {info.row.original.diffModified}
        </div>
      );
    },
  },
];
