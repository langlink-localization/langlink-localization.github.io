"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import UploadManager from "@/components/upload-manager";
import ConvertOption from "@/app/chinese_convert/convert-option";
import DownloadManager from "@/components/download-manager";
import { processXliffString } from "@/services/xliff-processor";
import { DataTable } from "./data-table";
import { TableData, xliffColumns } from "./columns";

export default function App() {
  // 状态管理上传的文件数据
  const [filesData, setFilesData] = useState<
    { name: string; content: string }[]
  >([]);

  // 状态管理转换后的数据
  const [xliffData, setXliffData] = useState<TableData[]>([]);

  const handleFileUpload = (
    uploadedFilesData: { name: string; content: string }[],
  ) => {
    setFilesData(uploadedFilesData);
  };

  const handFileConvert = () => {
    const allFilesData = filesData.map(async (fileData) => {
      return processXliffString(fileData.name, fileData.content);
    });

    Promise.all(allFilesData).then((data) => {
      setXliffData(data.flat());
    });
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
        <UploadManager onFilesUploaded={handleFileUpload} />
        <DownloadManager downloadItems={[]} />
      </div>
      <div className="mt-2 grid grid-cols-9 grid-rows-1 gap-2">
        <ConvertOption onOptionChange={() => console.log(``)} />
        <div className="col-start-5 flex gap-3">
          <Button
            className=" place-self-center text-sm"
            onClick={handFileConvert}
          >
            转换并展示表格
          </Button>
          <Button className=" place-self-center text-sm">
            直接创建下载链接
          </Button>
        </div>
      </div>
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

      <div className="container">
        <DataTable columns={xliffColumns} data={xliffData} />
      </div>
    </NextThemesProvider>
  );
}
