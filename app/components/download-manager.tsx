// DownloadManager.tsx
import React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// interface DownloadManagerProps {
//   downloadItems: {
//     key: string;
//     text: string;
//     href: string;
//     download: string;
//   }[];
// }

const DownloadManager = () => {
  const targtFileIds = Array.from({ length: 5 }, (_, i) => i + 1);
  const targtListData = [
    targtFileIds.map((id) => ({
      key: `targetFile${id}`,
      text: `out${id}_zhcn_zhhk.mqxliff`,
      href: `out${id}_zhcn_zhhk.mqxliff`,
      download: `out${id}_zhcn_zhhk.mqxliff`,
    })),
  ];

  return (
    <div className="col-span-1 col-start-2 mb-2 overflow-auto">
      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="rounded-lg">下载所有文件</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>点击下载所有文件</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="">
        {targtListData[0].map((item) => (
          <TooltipProvider key={item.key}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="rounded-lg text-xs underline"
                  variant="outline"
                >
                  <Link href={item.href} className="text-center text-sm">
                    {item.text}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default DownloadManager;
