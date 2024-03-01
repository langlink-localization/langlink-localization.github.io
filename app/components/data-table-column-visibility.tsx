"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type MyColumnDef<TData> = ColumnDef<TData> & {
  columnTitle?: string;
};
interface DataTableColsVisibilityProps<TData> {
  table: Table<TData>;
}

export function DataTableColsVisibility<TData>({
  table,
}: DataTableColsVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-md ml-auto flex h-8"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          展示/隐藏栏位
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>栏位</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            const title =
              (column.columnDef as MyColumnDef<TData>).columnTitle || column.id;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="noraml-case"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {title}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
