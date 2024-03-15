"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
// import parse from "html-react-parser";
// import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import UploadManager from "@/components/upload-manager";
import DownloadManager from "@/components/download-manager";

export default function App() {
  // 状态管理上传的文件数据
  const [filesData, setFilesData] = useState<
    { name: string; content: string }[]
  >([]);

  // 处理文件上传
  const handleFileUpload = (
    uploadedFilesData: { name: string; content: string }[],
  ) => {
    setFilesData(uploadedFilesData);
  };

  // 状态管理转换后的数据
  const [downloadItems, setDownloadItems] = useState<
    {
      key: string;
      content: string;
      text: string;
    }[]
  >([]);

  const generateFileName = (originalName: string) => {
    const lastIndex = originalName.lastIndexOf(".");
    const baseName =
      lastIndex > 0 ? originalName.slice(0, lastIndex) : originalName;
    const extension = lastIndex > 0 ? originalName.slice(lastIndex) : "";
    return `${baseName}_fixed${extension}`;
  };

  const processFilesForDownload = async () => {
    return filesData.map((fileData, index) => {
      const fixedContent = fileData.content
        .replace(/false"><source/g, 'false"/> <!-- <source')
        .replace(/<\/mq:insertedmatch>/g, "</mq:insertedmatch> -->");

      const downloadFileName = generateFileName(fileData.name);

      return {
        key: String(index),
        content: fixedContent,
        text: downloadFileName,
      };
    });
  };

  const handleFixAndDownload = async () => {
    const downloadItems = await processFilesForDownload();
    setDownloadItems(downloadItems);
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <div className="mb-4 flex flex-col justify-center">
        <p className="mb-2 text-center text-3xl">memoQ 文件 Xbench 报错修复</p>
        <Button variant="link">
          <Link href="./" className="text-md text-center">
            返回主页
          </Link>
        </Button>
      </div>
      <div className="grid-rows-auto grid grid-cols-2 overflow-auto px-1 pt-8">
        <UploadManager
          onFilesUploaded={handleFileUpload}
          buttonText="上传文件"
          tooltipText="点击上传文件"
          heightClass="h-20 md:h-28"
        />
        <DownloadManager
          downloadItems={downloadItems}
          buttonText="下载文件"
          tooltipText="下载所有文件"
          heightClass="h-20 md:h-28"
        />
      </div>
      <div className="mt-2 grid grid-cols-3 place-items-center gap-2">
        {filesData.length == 0 ? (
          <div className="col-start-2 flex gap-3">
            <Button
              size="lg"
              className="sm:text:sm place-self-center text-xs"
              disabled
            >
              上传并选择选项
            </Button>
          </div>
        ) : (
          <div className="col-start-2 flex gap-3">
            <Button
              size="lg"
              className="sm:text:sm place-self-center text-xs"
              onClick={() => handleFixAndDownload()}
            >
              修复文件
            </Button>
          </div>
        )}
      </div>
    </NextThemesProvider>
  );
}
