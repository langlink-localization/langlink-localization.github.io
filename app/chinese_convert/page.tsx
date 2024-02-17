"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UploadManager from "@/components/upload-manager";
import ConvertOption from "@/app/chinese_convert/convert-option";

export default function App() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ModeToggle />
      <div className="mb-4 flex flex-col justify-center">
        <p className="mb-2 text-center text-3xl">简繁转换</p>
        <Button asChild variant="link">
          <Link href="./" className="text-md text-center">
            返回主页
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <UploadManager
          onFilesUploaded={(files) =>
            console.log(`上传了${files.length}个文件`)
          }
        />
      </div>
      <ConvertOption onOptionChange={(languages) => console.log(languages)} />
    </NextThemesProvider>
  );
}
