"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TableData = {
  fileName: string;
  id: number;
  source: string;
  target: string;
};
export const xliffColumns: ColumnDef<TableData>[] = [
  {
    accessorKey: "fileName",
    header: "文件名",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "source",
    header: "原文",
  },
  {
    accessorKey: "target",
    header: "译文",
  },
];
