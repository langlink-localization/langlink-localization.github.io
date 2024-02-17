"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UploadManager from "@/components/upload-manager";
import ConvertOption from "@/app/chinese_convert/convert-option";
import DownloadManager from "@/components/download-manager";

export default function App() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ModeToggle />
      <div className="mb-4 flex flex-col justify-center">
        <p className="mb-2 text-center text-3xl">简繁转换</p>
        <Button variant="link">
          <Link href="./" className="text-md text-center">
            返回主页
          </Link>
        </Button>
      </div>
      <div className="grid-rows-auto grid grid-cols-2 overflow-auto pt-8">
        <UploadManager
          onFilesUploaded={(files) =>
            console.log(`上传了${files.length}个文件`)
          }
        />
        <DownloadManager downloadItems={[]} />
      </div>
      <ConvertOption onOptionChange={(languages) => console.log(languages)} />
    </NextThemesProvider>
  );
}
