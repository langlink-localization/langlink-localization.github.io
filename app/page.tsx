"use client";

import React from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ModeToggle } from "@/app/components/ui/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function App() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ModeToggle />
      <div className="flex min-h-screen justify-center">
        <div className="w-full max-w-4xl">
          <p className="mb-8 text-center text-3xl">LangLink 工具合集</p>
          <div className="grid-rows-auto grid grid-cols-2 gap-4 pt-8">
            <Card className="col-span-1 row-span-1">
              <CardHeader>
                <CardTitle>简繁转换</CardTitle>
                <CardDescription>上传双语文件，进行简繁转换</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  支持的文件类型：xliff, mqxliff, sdlxliff, xlf, txlf...
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link">
                  <Link href="/chinese_convert" className="text-xl">
                    访问
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 row-span-1">
              <CardHeader>
                <CardTitle>制作对比报告</CardTitle>
                <CardDescription>
                  上传两个版本的双语文件，制作对比报告
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  支持的文件类型：xliff, mqxliff, sdlxliff, xlf, txlf...
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link">
                  <Link href="/diff_maker" className="self-center text-xl">
                    访问
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 row-span-1">
              <CardHeader>
                <CardTitle>memoQ Adapt 转换</CardTitle>
                <CardDescription>
                  上传 memoQ 文件，制作 adapt 文件
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">支持的文件类型：mqxliff</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link">
                  <Link href="/memoq_adapt" className="self-center text-xl">
                    访问
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 row-span-1">
              <CardHeader>
                <CardTitle>memoQ 文件 Xbench 报错修复</CardTitle>
                <CardDescription>
                  上传 memoQ 文件，修复 Xbench 报错
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">支持的文件类型：mqxliff</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link">
                  <Link
                    href="/memoq_file_error_fix"
                    className="self-center text-xl"
                  >
                    访问
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </NextThemesProvider>
  );
}
