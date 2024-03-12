"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConvertOption from "@/app/chinese_convert/convert-option";
import UploadManager from "@/components/upload-manager";
import DownloadManager from "@/components/download-manager";
import { openCCConverter } from "@/services/opencc-converter";
import { xliffProcessor } from "@/services/xliff-processor";
import { diff2Html } from "@/services/diff2html";
import { tagProcessor } from "@/services/tag-processor";
import { DataTable } from "./data-table";
import { TableData, xliffColumns } from "./columns";

export default function App() {
  // 状态管理上传的文件数据
  const [filesData, setFilesData] = useState<
    { name: string; content: string }[]
  >([]);

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

  // 处理文件上传
  const handleFileUpload = (
    uploadedFilesData: { name: string; content: string }[],
  ) => {
    setFilesData(uploadedFilesData);
  };

  // 状态管理转换后的数据
  const [xliffData, setXliffData] = useState<TableData[]>([]);
  const [shortenedXliffData, setShortenedXliffData] = useState<TableData[]>([]);
  const [grayedXliffData, setGrayedXliffData] = useState<TableData[]>([]);
  const [currentDataForm, setCurrentDataForm] = useState<
    "grayed" | "shortened"
  >("grayed");

  const handFileConvert = async () => {
    const processedData = await Promise.all(
      filesData.map(async (fileData) => {
        const convertedContent = openCCConverter(fileData.content, config);
        const originalXliffData = await xliffProcessor(
          fileData.name,
          fileData.content,
        );
        const convertedXliffData = await xliffProcessor(
          fileData.name,
          convertedContent,
        );

        return originalXliffData.map((item, index) => {
          const convertResult = convertedXliffData[index]?.target;
          const diffResult = diff2Html(item.target, convertResult, "chars");

          const grayedData = {
            ...item,
            source: item.source,
            target: item.target,
            convertResult: convertResult,
            finalSource: tagProcessor(item.source).grayedString,
            finalTarget: tagProcessor(item.target).grayedString,
            finalConvertResult: tagProcessor(convertResult).grayedString,
            isSame: diffResult.isSame,
          };

          const shortenedData = {
            ...item,
            source: item.source,
            target: item.target,
            convertResult: convertResult,
            finalSource: tagProcessor(item.source).shortenedString,
            finalTarget: tagProcessor(item.target).shortenedString,
            finalConvertResult: tagProcessor(convertResult).shortenedString,
            isSame: diffResult.isSame,
          };

          return { grayedData, shortenedData };
        });
      }),
    );

    let grayed = processedData.flat().map((item) => item.grayedData);
    let shortened = processedData.flat().map((item) => item.shortenedData);

    setGrayedXliffData(grayed);
    setShortenedXliffData(shortened);
  };

  const toggleDataForm = () => {
    setCurrentDataForm(currentDataForm === "grayed" ? "shortened" : "grayed");
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
        <DataTable
          columns={xliffColumns}
          data={
            currentDataForm === "grayed" ? grayedXliffData : shortenedXliffData
          }
          currentDataForm={currentDataForm}
          toggleDataForm={toggleDataForm}
        />
      </div>
    </NextThemesProvider>
  );
}
