"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

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

export const xliffColumns: ColumnDef<TableData>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-24 pl-3"
        column={column}
        title="文件名"
      />
    ),
    cell: (info) => (
      <div className="w-24 overflow-auto pl-3">
        {info.row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader className="w-12 pl-3" column={column} title="ID" />
    ),
    cell: (info) => <div className="w-12 pl-3">{info.row.original.id}</div>,
  },
  {
    accessorKey: "percent",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-14 pl-3"
        column={column}
        title="百分比"
      />
    ),
    cell: (info) => (
      <div className="w-14 pl-3">{info.row.original.percent}</div>
    ),
  },
  {
    accessorKey: "isSame",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-14 pl-3"
        column={column}
        title="是否相同"
      />
    ),
    cell: (info) => <div className="w-14 pl-3">{info.row.original.isSame}</div>,
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-80 pl-3"
        column={column}
        title="原文"
      />
    ),
    cell: (info) => (
      <div className="w-80 overflow-auto text-balance pl-3">
        {info.row.original.source}
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-80 pl-3"
        column={column}
        title="译文"
      />
    ),
    cell: (info) => {
      // const diffResult = diff2Html(
      //   info.row.original.target,
      //   info.row.original.convertResult,
      //   "chars",
      // );
      // return (
      //   <div className="w-80 overflow-auto text-balance pl-3">
      //     {diffResult.original}
      //   </div>
      // );
      return (
        <div className="w-80 overflow-auto text-balance pl-3">
          {info.row.original.diffOriginal}
        </div>
      );
    },
  },
  {
    accessorKey: "convertResult",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-80 pl-3"
        column={column}
        title="转换结果"
      />
    ),
    cell: (info) => {
      // const diffResult = diff2Html(
      //   info.row.original.target,
      //   info.row.original.convertResult,
      //   "chars",
      // );
      // return (
      //   <div className="w-80 overflow-auto text-balance pl-3">
      //     {diffResult.modified}
      //   </div>
      // );
      return (
        <div className="w-80 overflow-auto text-balance pl-3">
          {info.row.original.diffModified}
        </div>
      );
    },
  },
];
