"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConvertOption from "@/app/chinese_convert/convert-option";
import UploadManager from "@/components/upload-manager";
import DownloadManager from "@/components/download-manager";
import { openCCConverter } from "@/services/opencc-converter";
import { xliffProcessor } from "@/services/xliff-processor";
import { diff2Html } from "@/services/diff2html";
import { DataTable } from "./data-table";
import { TableData, xliffColumns } from "./columns";

export default function App() {
  // 状态管理上传的文件数据
  const [filesData, setFilesData] = useState<
    { name: string; content: string }[]
  >([]);

  // 状态管理转换后的数据
  const [xliffData, setXliffData] = useState<TableData[]>([]);

  // 状态管理转换选项
  const [config, setConfig] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });

  // 处理转换选项变化
  const handleOptionChange = useCallback(
    (newConfig: { from: string; to: string }) => {
      setConfig(newConfig);
    },
    [],
  );

  // 监听转换选项变化
  useEffect(() => {
    if (config.from && config.to) {
      console.log(`config: ${config.from}2${config.to}`);
    }
  }, [config]);

  // 处理文件上传
  const handleFileUpload = (
    uploadedFilesData: { name: string; content: string }[],
  ) => {
    setFilesData(uploadedFilesData);
  };

  // 处理文件转换
  const handFileConvert = async () => {
    const convertedFilesData = await Promise.all(
      filesData.map(async (fileData) => {
        const convertedContent = openCCConverter(fileData.content, config);
        return {
          name: fileData.name,
          originalContent: fileData.content,
          convertedContent,
        };
      }),
    );

    // 处理Xliff文件
    const allFilesXliffData = await Promise.all(
      convertedFilesData.map(async (fileData) => {
        const originalXliffData = await xliffProcessor(
          fileData.name,
          fileData.originalContent,
        );
        const convertedXliffData = await xliffProcessor(
          fileData.name,
          fileData.convertedContent,
        );

        const mergedXliffData = originalXliffData.map((item, index) => {
          const diffResult = diff2Html(
            item.target,
            convertedXliffData[index]?.target,
            "chars",
          );

          return {
            ...item,
            convertResult: convertedXliffData[index]?.target,
            diffOriginal: diffResult.original,
            diffModified: diffResult.modified,
            isSame: diffResult.isSame,
          };
        });

        return mergedXliffData;
      }),
    );

    setXliffData(allFilesXliffData.flat());
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
        <ConvertOption onOptionChange={handleOptionChange} />
        <div className="col-start-5 flex gap-3">
          <Button
            className="md:text:sm place-self-center text-xs"
            onClick={handFileConvert}
          >
            转换并展示表格
          </Button>
          <Button className="md:text:sm place-self-center text-xs">
            直接创建下载链接
          </Button>
        </div>
      </div>
      <div className="grid-rows-auto grid-cols-14 mt-4 grid gap-2">
        <div className="col-span-2 col-start-11 row-span-1 flex-col">
          <Input
            placeholder="查找内容"
            className="mb-2 w-[8rem] text-xs md:w-full md:text-sm"
          />
          <Input
            placeholder="替换内容"
            className="mt-2 w-[8rem] text-xs md:w-full md:text-sm"
          />
        </div>
        <Button className="col-span-1 col-start-13 self-center justify-self-start text-xs md:text-sm">
          查找替换
        </Button>
      </div>
      <div className="max-h-lvh">
        <DataTable columns={xliffColumns} data={xliffData} />
      </div>
    </NextThemesProvider>
  );
}
