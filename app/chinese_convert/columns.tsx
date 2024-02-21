"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export type TableData = {
  fileName: string;
  id: number;
  source: string;
  target: string;
  convertResult: string;
};
export const xliffColumns: ColumnDef<TableData>[] = [
  // {
  //   accessorKey: "fileName",
  //   header: () => <div className="w-20">文件名</div>,
  //   cell: (info) => (
  //     <div className="w-20 text-warp">{info.row.original.fileName}</div>
  //   ),
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader className="w-10" column={column} title="ID" />
    ),
    cell: (info) => (
      <div className="max-h-fit w-10">{info.row.original.id}</div>
    ),
  },
  {
    accessorKey: "原文",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="原文" />
    ),
    cell: (info) => (
      <div className="max-h-max max-w-md overflow-auto text-balance">
        {info.row.original.source}
      </div>
    ),
  },
  {
    accessorKey: "译文",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="译文" />
    ),
    cell: (info) => (
      <div className="max-h-max max-w-md overflow-auto text-balance">
        {info.row.original.target}
      </div>
    ),
  },
  {
    accessorKey: "转换结果",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="转换结果" />
    ),
    cell: (info) => (
      <div className="max-h-max max-w-md overflow-auto text-balance">
        {info.row.original.target}
      </div>
    ),
  },
];
