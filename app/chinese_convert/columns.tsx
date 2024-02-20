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
    size: 50,
  },
  {
    accessorKey: "id",
    header: "ID",
    size: 20,
  },
  {
    accessorKey: "source",
    header: "原文",
    size: 100,
    maxSize: 200,
  },
  {
    accessorKey: "target",
    header: "译文",
    size: 100,
    maxSize: 200,
  },
];
