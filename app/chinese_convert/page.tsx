"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import UploadManager from "@/app/components/UploadManager";
import ConvertOption from "@/app/chinese_convert/ConvertOption";

import {
  Link,
  Button,
  Select,
  SelectSection,
  SelectItem,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
} from "@nextui-org/react";

const handleOptionChange = (languages: [string, string]) => {
  console.log(`原文语言：${languages[0]}，目标语言：${languages[1]}`);
};

export default function App() {
  const targtFileIds = Array.from({ length: 5 }, (_, i) => i + 1);
  const targtListData = [
    targtFileIds.map((id) => ({
      key: `targetFile${id}`,
      text: `out${id}_zhcn_zhhk.mqxliff`,
      href: `out${id}_zhcn_zhhk.mqxliff`,
      download: `out${id}_zhcn_zhhk.mqxliff`,
    })),
  ];

  const rowIds = Array.from({ length: 30 }, (_, i) => i + 1);
  const staticData = {
    original:
      "Posted by Ben Mathes and Neoklis Polyzotis, on behalf of the TFX Team",
    zh_cn: "由 Ben Mathes 和 Neoklis Polyzotis 代表 TFX 团队发布",
    zh_hk: "由 Ben Mathes 和 Neoklis Polyzotis 代表 TFX 團隊發布",
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ThemeSwitcher />
      <div className="flex justify-center">
        <p className="mb-8 text-center text-3xl">简繁转换</p>
      </div>
      <div className="flex justify-center">
        <Link
          href="../"
          className="hover:text-primary text-md"
          color="foreground"
          underline="hover"
          isBlock
        >
          返回主页
        </Link>
      </div>
      <div className="grid-rows-auto grid grid-cols-2 overflow-auto pt-8">
        <UploadManager onFilesUploaded={(files) => console.log(`上传了${files.length}个文件`)} />
        <div className="col-span-1 col-start-2">
          <div className="text-center">
            <Tooltip content="点击下载所有文件" showArrow={true}>
              <Button className="" radius="full" color="primary">
                下载所有文件
              </Button>
            </Tooltip>
          </div>
          {targtListData[0].map((item) => (
            <Tooltip
              key={item.key}
              content="点击下载"
              showArrow={true}
              delay={1000}
              size="sm"
            >
              <Chip key={item.key} variant="dot">
                <Link
                  href={item.href}
                  download={item.download}
                  className="hover:underline"
                >
                  {item.text}
                </Link>
              </Chip>
            </Tooltip>
          ))}
        </div>
        <div className="col-span-2 mt-4 grid grid-cols-4 grid-rows-1"></div>
      </div>
      <ConvertOption onOptionChange={handleOptionChange} />
      <div className="grid-rows-auto mt-4 grid grid-cols-12">
        <Input
          isClearable
          type="查找内容"
          label="查找内容"
          variant="bordered"
          labelPlacement="inside"
          className="col-span-2 col-start-8 row-span-1"
        />
        <Input
          isClearable
          type="替换内容"
          label="替换内容"
          variant="bordered"
          labelPlacement="inside"
          className="col-span-2 col-start-10 row-span-1"
        />
        <Button
          className="col-span-1 col-start-12 row-span-1 w-[40%] self-center justify-self-start"
          radius="full"
          color="primary"
          size="md"
        >
          查找替换
        </Button>
      </div>
      <Table
        isCompact
        isStriped
        isHeaderSticky
        aria-label="简繁转换结果"
        color="primary"
        selectionMode="multiple"
        radius="sm"
        className="mt-4"
      >
        <TableHeader>
          <TableColumn>序号</TableColumn>
          <TableColumn>原文</TableColumn>
          <TableColumn>zh-cn</TableColumn>
          <TableColumn>zh-hk</TableColumn>
        </TableHeader>
        <TableBody emptyContent={<p>暂无数据</p>}>
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
