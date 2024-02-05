"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
} from "@nextui-org/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/ThemeSwitchers";

export default function App() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ThemeSwitcher />
      <div className="flex min-h-screen justify-center">
        <div className="w-full max-w-4xl">
          <p className="mb-8 text-center text-3xl">LangLink 工具合集</p>
          <div className="grid-rows-auto grid w-full grid-cols-2 gap-4 pt-8">
            <Card
              className="col-span-1 row-span-1 m-4 flex h-48 flex-col"
              radius="lg"
              shadow="md"
            >
              <CardHeader></CardHeader>
              <CardBody className="flex items-center justify-center">
                <Link
                  href="/chinese_convert"
                  isBlock
                  underline="hover"
                  color="foreground"
                  className="hover:text-primary text-xl"
                >
                  简繁转换
                </Link>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
            <Card
              className="col-span-1 row-span-1 m-4 flex h-48 flex-col"
              radius="lg"
              shadow="md"
            >
              <CardHeader></CardHeader>
              <CardBody className="flex items-center justify-center">
                <Link
                  href="/diff_maker"
                  isBlock
                  underline="hover"
                  color="foreground"
                  className="hover:text-primary text-xl"
                >
                  制作对比报告
                </Link>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
            <Card
              className="col-span-1 row-span-1 m-4 flex h-48 flex-col"
              radius="lg"
              shadow="md"
            >
              <CardHeader></CardHeader>
              <CardBody className="flex items-center justify-center">
                <Link
                  href="/memoq_adapt"
                  isBlock
                  underline="hover"
                  color="foreground"
                  className="hover:text-primary text-xl"
                >
                  memoQ Adapt 转换
                </Link>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
            <Card
              className="col-span-1 row-span-1 m-4 flex h-48 flex-col"
              radius="lg"
              shadow="md"
            >
              <CardHeader></CardHeader>
              <CardBody className="flex items-center justify-center">
                <Link
                  href="memoq_file_error_fix"
                  isBlock
                  underline="hover"
                  color="foreground"
                  className="hover:text-primary text-xl"
                >
                  memoQ 文件 Xbench 报错修复
                </Link>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </NextThemesProvider>
  );
}
