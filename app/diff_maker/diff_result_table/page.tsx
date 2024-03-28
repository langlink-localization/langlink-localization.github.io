"use client";

import React, { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
import { TableData } from "../columns";
import "./style.css";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const fetchGrayedXliffData = () => {
  console.log(
    `fetchGrayedXliffData: ${localStorage.getItem("grayedXliffData")}`
  );
  return JSON.parse(
    localStorage.getItem("grayedXliffData") || ("[]" as string)
  ) as TableData[];
};

const selectTableBody = () => {
  const table = document.getElementById("table");
  if (table) {
    const tableHeaderElement = table.querySelector("thead");
    tableHeaderElement?.remove();
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
  }
};

export default function App() {
  const redRegex = `text-red-600 underline underline-offset-[3px] decoration-dotted
 dark:text-red-400`;
  const skyRegex = `text-sky-600 underline underline-offset-[3px]
 dark:text-sky-400`;
  const grayedXliffData = fetchGrayedXliffData();

  useEffect(() => {
    localStorage.removeItem("grayedXliffData");
  }, []);

  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='light'
    >
      <div className='mb-4 flex flex-col justify-center'>
        <p className='mb-2 text-center text-3xl'>复制对比表格内容</p>
        <Button variant='link'>
          <Link
            href='/diff_maker'
            className='text-md text-center'
          >
            返回上一页
          </Link>
        </Button>
      </div>
      <Button
        size='lg'
        className='place-self-center text-xs sm:text-sm'
        onClick={() => selectTableBody()}
      >
        一键复制表格内容
      </Button>
      <Table id='table'>
        <TableHeader>
          <TableRow>
            <TableHead>文件名</TableHead>
            <TableHead>序号</TableHead>
            <TableHead>原文</TableHead>
            <TableHead>译文1</TableHead>
            <TableHead>译文2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grayedXliffData.map((item) => (
            <TableRow key={item.fileName}>
              <TableCell>{item.fileName}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell
                dangerouslySetInnerHTML={{ __html: item.finalSource }}
              />
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: item.finalTarget1
                    .replaceAll(redRegex, "text-red")
                    .replaceAll(skyRegex, "text-sky"),
                }}
              />
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: item.finalTarget2
                    .replaceAll(redRegex, "text-red")
                    .replaceAll(skyRegex, "text-sky"),
                }}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </NextThemesProvider>
  );
}
