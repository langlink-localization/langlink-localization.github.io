"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import UploadManager from "@/components/upload-manager";
import ConvertOption from "@/app/chinese_convert/convert-option";
import DownloadManager from "@/components/download-manager";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function App() {
  const rowIds = Array.from({ length: 30 }, (_, i) => i + 1);
  const staticData = {
    original:
      "Posted by Ben Mathes and Neoklis Polyzotis, on behalf of the TFX Team",
    zh_cn: "由 Ben Mathes 和 Neoklis Polyzotis 代表 TFX 团队发布",
    zh_hk: "由 Ben Mathes 和 Neoklis Polyzotis 代表 TFX 團隊發布",
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
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
      <div className="grid-rows-auto mt-4 grid grid-cols-12 gap-2">
        <Input
          placeholder="查找内容"
          className="col-span-2 col-start-8 row-span-1"
        />
        <Input
          placeholder="替换内容"
          className="col-span-2 col-start-10 row-span-1"
        />
        <Button className="col-span-1 col-start-12 row-span-1 self-center justify-self-start">
          查找替换
        </Button>
      </div>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>原文</TableHead>
            <TableHead>译文</TableHead>
            <TableHead>zh-hk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowIds.map((id) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{staticData.original}</TableCell>
              <TableCell>{staticData.zh_cn}</TableCell>
              <TableCell>{staticData.zh_hk}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </NextThemesProvider>
  );
}
