"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex justify-end p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-transparent"
              onClick={toggleTheme}
            >
              {!ready ? (
                <span className="h-[1.2rem] w-[1.2rem] animate-pulse bg-gray-300" />
              ) : theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>切换主题</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
