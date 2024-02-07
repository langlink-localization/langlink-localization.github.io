"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ModeToggle } from "@/app/components/ui/mode-toggle";

export default function App() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ModeToggle />
      <div className="flex min-h-screen justify-center">
        <div className="w-full max-w-4xl">
          <p className="mb-8 text-center text-3xl">LangLink 工具合集</p>
        </div>
      </div>
    </NextThemesProvider>
  );
}
