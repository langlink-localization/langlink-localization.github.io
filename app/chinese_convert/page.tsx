"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { ListboxWrapper } from "@/components/ListboxWrapper";
import UploadManager from "@/components/UploadManager";

import {
  Link,
  Button,
  Card,
  Listbox,
  ListboxSection,
  ListboxItem,
  Select,
  SelectSection,
  SelectItem,
  Spacer,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tab,
} from "@nextui-org/react";

export default function App() {
  const tgtFileIds = Array.from({ length: 5 }, (_, i) => i + 1);
  const tgtListData = [
    tgtFileIds.map((id) => ({
      key: `targetFile${id}`,
      text: `out${id}_zhcn_zhhk.mqxliff`,
      href: "out${id}_zhcn_zhhk.mqxliff",
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
      <div className="grid-rows-auto grid grid-cols-2 pt-8">
        <UploadManager onFilesUploaded={(files) => console.log(files)} />
        <div className="col-span-1 col-start-2">
          <Button className="place-self-center" radius="full" color="primary">
            下载所有文件
          </Button>
          <Listbox color="primary" variant="bordered" className="">
            <ListboxSection>
              {tgtListData[0].map((item) => (
                <ListboxItem
                  key={item.key}
                  className="text-center hover:underline"
                  download={item.download}
                  href={item.href}
                >
                  {item.text}
                </ListboxItem>
              ))}
            </ListboxSection>
          </Listbox>
        </div>
        <div className="col-span-2 mt-4 grid grid-cols-4 grid-rows-1">
          <Select
            label="选择原文语言"
            placeholder="请选择一个语言"
            defaultSelectedKeys={["zh-cn"]}
            size="sm"
            variant="bordered"
            className="col-span-1 col-start-1"
          >
            <SelectSection showDivider title="简中">
              <SelectItem key="zh-cn">zh-cn</SelectItem>
            </SelectSection>
            <SelectSection showDivider title="繁中">
              <SelectItem key="zh-hk">zh-hk</SelectItem>
              <SelectItem key="zh-tw">zh-tw</SelectItem>
              <SelectItem key="zh-tw+twphrase">zh-tw+twp</SelectItem>
            </SelectSection>
          </Select>

          <Select
            label="选择目标语言"
            placeholder="请选择一个语言"
            defaultSelectedKeys={["zh-hk"]}
            size="sm"
            variant="bordered"
            className="col-span-1 col-start-2"
          >
            <SelectSection showDivider title="简中">
              <SelectItem key="zh-cn">zh-cn</SelectItem>
            </SelectSection>
            <SelectSection showDivider title="繁中">
              <SelectItem key="zh-hk">zh-hk</SelectItem>
              <SelectItem key="zh-tw">zh-tw</SelectItem>
              <SelectItem key="zh-tw+twphrase">zh-tw+twp</SelectItem>
            </SelectSection>
          </Select>
          <div className="col-span-2 col-start-3 flex">
            <Button
              className=" place-self-center text-xs"
              radius="md"
              color="primary"
              size="sm"
            >
              转换并展示表格
            </Button>
            <Button
              className=" place-self-center text-xs"
              radius="md"
              color="primary"
              size="sm"
            >
              直接创建下载链接
            </Button>
          </div>
        </div>
      </div>
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
