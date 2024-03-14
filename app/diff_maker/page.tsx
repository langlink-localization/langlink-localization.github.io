"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
// import parse from "html-react-parser";
// import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import UploadManager from "@/components/upload-manager";
import { xliffProcessor } from "@/services/xliff-processor";
import { diff2Html } from "@/services/diff2html";
import { tagProcessor } from "@/services/tag-processor";
import { DataTable } from "./data-table";
import { TableData, xliffColumns } from "./columns";

export default function App() {
  // 状态管理上传的文件数据
  const [filesData1, setFilesData1] = useState<
    { name: string; content: string }[]
  >([]);

  const [filesData2, setFilesData2] = useState<
    { name: string; content: string }[]
  >([]);

  // 处理文件上传
  const handleFileUpload1 = (
    uploadedFilesData: { name: string; content: string }[],
  ) => {
    setFilesData1(uploadedFilesData);
  };

  const handleFileUpload2 = (
    uploadedFilesData: { name: string; content: string }[],
  ) => {
    setFilesData2(uploadedFilesData);
  };

  const [shortenedXliffData, setShortenedXliffData] = useState<TableData[]>([]);
  const [grayedXliffData, setGrayedXliffData] = useState<TableData[]>([]);
  const [currentDataForm, setCurrentDataForm] = useState<
    "grayed" | "shortened"
  >("grayed");

  const handleFileConvert = async () => {
    const processedData = await Promise.all(
      filesData1.map(async (fileData1, index) => {
        const fileData2 = filesData2[index];

        const xliffData1 = await xliffProcessor(
          fileData1.name,
          fileData1.content,
        );
        const xliffData2 = await xliffProcessor(
          fileData2.name,
          fileData2.content,
        );

        return xliffData1.map((item1, index) => {
          const target2 = xliffData2[index]?.target;
          const diffResult = diff2Html(item1.target, target2, "chars");

          const grayedData = {
            ...item1,
            source: item1.source,
            target1: item1.target,
            target2: target2,
            finalSource: tagProcessor(item1.source).grayedString,
            finalTarget1: tagProcessor(diffResult.oldHtml).grayedString,
            finalTarget2: tagProcessor(diffResult.newHtml).grayedString,
            isSame: diffResult.isSame,
          };

          const shortenedData = {
            ...item1,
            source: item1.source,
            target1: item1.target,
            target2: target2,
            finalSource: tagProcessor(item1.source).shortenedString,
            finalTarget1: tagProcessor(diffResult.oldHtml).shortenedString,
            finalTarget2: tagProcessor(diffResult.newHtml).shortenedString,
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
        <p className="mb-2 text-center text-3xl">制作对比报告</p>
        <Button variant="link">
          <Link href="./" className="text-md text-center">
            返回主页
          </Link>
        </Button>
      </div>
      <div className="grid-rows-auto grid grid-cols-2 overflow-auto px-1 pt-8">
        <UploadManager
          onFilesUploaded={handleFileUpload1}
          buttonText="上传文件1"
          tooltipText="点击上传文件1"
        />
        <UploadManager
          onFilesUploaded={handleFileUpload2}
          buttonText="上传文件2"
          tooltipText="点击上传文件2"
        />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {filesData1.length == 0 ? (
          <div className="col-start-2 flex h-8 gap-3 place-self-center">
            <Button
              size="lg"
              className="sm:text:sm h-[95%] place-self-center text-xs"
              disabled
            >
              上传并选择选项
            </Button>
          </div>
        ) : (
          <div className="col-start-2 flex h-8 gap-3 place-self-center">
            <Button
              size="lg"
              className="sm:text:sm h-[95%] place-self-center text-xs"
              onClick={() => handleFileConvert()}
            >
              转换并展示表格
            </Button>
          </div>
        )}
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
