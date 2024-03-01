import { EyeOff } from "lucide-react";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="text-md -ml-3 h-8 hover:bg-transparent"
      >
        <span>{title}</span>
        <EyeOff
          className="ml-2 h-3.5 w-3.5 hover:scale-125"
          onClick={() => column.toggleVisibility(false)}
        />
      </Button>
    </div>
  );
}
