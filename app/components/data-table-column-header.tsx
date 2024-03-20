import { EyeOff, Group, Ungroup } from "lucide-react";
import { Column, RowSelection } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div
      className={cn(
        "sticky top-16 inline-flex bg-white sm:top-12 dark:bg-[#020817] ",
        className,
      )}
    >
      {column.getCanGroup() ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-md w-full justify-start hover:bg-white dark:hover:bg-inherit"
        >
          {column.getIsGrouped() ? (
            <Ungroup
              className="h-4 w-4 hover:scale-125"
              onClick={() => column.toggleGrouping()}
            />
          ) : (
            <Group
              className="h-4 w-4 hover:scale-125"
              onClick={() => column.toggleGrouping()}
            />
          )}
          <span onClick={() => column.toggleGrouping()} className="px-1">
            {title}
          </span>
          <EyeOff
            className="h-4 w-4 hover:scale-125"
            onClick={() => column.toggleVisibility(false)}
          />{" "}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="text-md w-full justify-start hover:bg-white dark:hover:bg-inherit"
        >
          <span onClick={() => column.toggleGrouping()} className="pr-1">
            {title}
          </span>
          <EyeOff
            className="h-4 w-4 hover:scale-125"
            onClick={() => column.toggleVisibility(false)}
          />
        </Button>
      )}
    </div>
  );
}
