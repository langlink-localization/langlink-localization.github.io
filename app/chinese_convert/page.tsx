"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
// import parse from "html-react-parser";
// import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import ConvertOption from "@/components/convert-option";
import UploadManager from "@/components/upload-manager";
import DownloadManager from "@/components/download-manager";
import { Textarea } from "@/components/ui/textarea";
import { openCCConverter } from "@/services/opencc-converter";
import { xliffProcessor } from "@/services/xliff-processor";
import { tmxProcessor } from "@/services/tmx-processor";
import { diff2Html } from "@/services/diff2html";
import { tagProcessor } from "@/services/tag-processor";
import { DataTable } from "@/components/data-table";
import { TableData, xliffColumns } from "./columns";
import { Label } from "../components/ui/label";

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

  // 存储用户在textarea中输入的原始文本
  const [customDictInput, setCustomDictInput] = useState("");

  // 存储处理过后的查找和替换词对
  const [customDict, setCustomDict] = useState<Array<[string, string]>>([]);

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
  const [shortenedXliffData, setShortenedXliffData] = useState<TableData[]>([]);
  const [grayedXliffData, setGrayedXliffData] = useState<TableData[]>([]);
  const [currentDataForm, setCurrentDataForm] = useState<
    "grayed" | "shortened"
  >("grayed");

  const [searchText, setSearchText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");

  const generateFileName = (originalName: string, from: string, to: string) => {
    const lastIndex = originalName.lastIndexOf(".");
    const baseName =
      lastIndex > 0 ? originalName.slice(0, lastIndex) : originalName;
    const extension = lastIndex > 0 ? originalName.slice(lastIndex) : "";
    return `${baseName}_${from}2${to}${extension}`;
  };

  // 处理转换选项变化
  const handleOptionChange = useCallback(
    (newConfig: { from: string; to: string }) => {
      setConfig(newConfig);
    },
    [],
  );

  const handleProcessCustomDictInput = useCallback(() => {
    // 通过换行符分隔输入，获取每一行
    const lines = customDictInput.split("\n");
    // 解析每行，并构建查找替换词对数组
    const newCustomDict = lines
      .map((line) => {
        const parts = line.trim().split("，"); // 假设查找和替换词汇通过逗号分隔
        if (parts.length === 2) {
          return [parts[0].trim(), parts[1].trim()] as [string, string];
        }
        return null;
      })
      .filter((pair) => pair !== null) as Array<[string, string]>;

    // 更新处理过后的查找和替换词对状态
    setCustomDict(newCustomDict);
  }, [customDictInput]);

  const processFilesForDownload = async () => {
    return filesData.map((fileData, index) => {
      let convertedContent = openCCConverter(
        fileData.content,
        config,
        customDict,
      );
      if (searchText.trim() !== "" && replaceText.trim() !== "") {
        convertedContent = findAndReplace(
          convertedContent,
          searchText,
          replaceText,
        );
      }

      const downloadFileName = generateFileName(
        fileData.name,
        config.from,
        config.to,
      );
      return {
        key: String(index),
        content: convertedContent,
        text: downloadFileName,
      };
    });
  };

  const findAndReplace = (
    content: string,
    findText: string,
    replaceText: string,
  ) => {
    const regex = new RegExp(findText, "g");
    return content.replace(regex, replaceText);
  };

  const handleFileConvert = async () => {
    const processedData = await Promise.all(
      filesData.map(async (fileData) => {
        let convertedContent = openCCConverter(
          fileData.content,
          config,
          customDict,
        );

        if (searchText.trim() !== "" && replaceText.trim() !== "") {
          convertedContent = findAndReplace(
            convertedContent,
            searchText,
            replaceText,
          );
        }

        let originalData = fileData.name.endsWith(".tmx")
          ? await tmxProcessor(fileData.name, fileData.content)
          : await xliffProcessor(fileData.name, fileData.content);
        let convertedData = fileData.name.endsWith(".tmx")
          ? await tmxProcessor(fileData.name, convertedContent)
          : await xliffProcessor(fileData.name, convertedContent);

        return originalData.map((item, index) => {
          const convertResult = convertedData[index]?.target;
          const diffResult = diff2Html(item.target, convertResult, "chars");

          const grayedData = {
            ...item,
            source: item.source,
            target: item.target,
            convertResult: convertResult,
            finalSource: tagProcessor(item.source).grayedString,
            finalTarget: tagProcessor(diffResult.oldHtml).grayedString,
            finalConvertResult: tagProcessor(diffResult.newHtml).grayedString,
            isSame: diffResult.isSame,
          };

          const shortenedData = {
            ...item,
            source: item.source,
            target: item.target,
            convertResult: convertResult,
            finalSource: tagProcessor(item.source).shortenedString,
            finalTarget: tagProcessor(diffResult.oldHtml).shortenedString,
            finalConvertResult: tagProcessor(diffResult.newHtml)
              .shortenedString,
            isSame: diffResult.isSame,
          };

          return { grayedData, shortenedData };
        });
      }),
    );

    const downloadItems = await processFilesForDownload();

    let grayed = processedData.flat().map((item) => item.grayedData);
    let shortened = processedData.flat().map((item) => item.shortenedData);

    setGrayedXliffData(grayed);
    setShortenedXliffData(shortened);
    setDownloadItems(downloadItems);
  };

  const handleDirectDownload = async () => {
    const downloadItems = await processFilesForDownload();
    setDownloadItems(downloadItems);
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
      <div className="grid-rows-auto grid grid-cols-3 overflow-auto px-1 pt-8">
        <UploadManager
          onFilesUploaded={handleFileUpload}
          buttonText="上传文件"
          tooltipText="点击上传文件"
          heightClass="h-40 md:h-56"
        />
        <DownloadManager
          downloadItems={downloadItems}
          buttonText="下载文件"
          tooltipText="下载所有文件"
          heightClass="h-40 md:h-56"
        />
        <div className="justify-items-center">
          <Label htmlFor="customDict" className="flex-col">
            <p className="text-sm">自定义字词转换</p>
            <p className="text-muted-foreground text-xs">
              每行一对，中文逗号分隔
            </p>
          </Label>
          <Textarea
            id="customDict"
            placeholder={`例如：\n原字词1，替换字词1\n原字词2，替换字词2`}
            value={customDictInput}
            onChange={(e) => setCustomDictInput(e.target.value)}
            rows={8}
            className="w-full rounded border p-2 text-xs"
          ></Textarea>
          <p className="text-muted-foreground text-xs">
            输入完后，按确认按钮，然后按转换按钮
          </p>
          <Button
            size="lg"
            className="sm:text:sm text-xs"
            onClick={handleProcessCustomDictInput}
            disabled={customDictInput.trim() === ""}
          >
            确认
          </Button>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-9 grid-rows-1 gap-2">
        <ConvertOption onOptionChange={handleOptionChange} />

        <div className="col-start-5 flex gap-3">
          {filesData.length == 0 || config.from === "" || config.to === "" ? (
            <div className="col-start-5 flex gap-3">
              <Button
                size="lg"
                className="sm:text:sm h-[95%] place-self-center text-xs"
                disabled
              >
                上传并选择选项
              </Button>
              <Button
                size="lg"
                className="sm:text:sm h-[95%] place-self-center text-xs"
                disabled
              >
                上传并选择选项
              </Button>
            </div>
          ) : (
            <div className="col-start-5 flex gap-3">
              <Button
                size="lg"
                className="sm:text:sm h-[95%] place-self-center text-xs"
                onClick={() => handleFileConvert()}
              >
                转换并展示表格
              </Button>
              <Button
                size="lg"
                className="sm:text:sm h-[95%] place-self-center text-xs"
                onClick={handleDirectDownload}
              >
                直接创建下载链接
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="max-h-lvh">
        <DataTable
          columns={xliffColumns}
          data={
            currentDataForm === "grayed" ? grayedXliffData : shortenedXliffData
          }
          showFindAndReplace={true}
          currentDataForm={currentDataForm}
          toggleDataForm={toggleDataForm}
          onSearchTextChange={setSearchText}
          onReplaceTextChange={setReplaceText}
          onFindAndReplace={handleFileConvert}
        />
      </div>
    </NextThemesProvider>
  );
}
