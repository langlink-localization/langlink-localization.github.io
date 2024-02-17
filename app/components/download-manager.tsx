// DownloadManager.tsx
import React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DownloadManagerProps {
  downloadItems: {
    key: string;
    text: string;
    href: string;
    download: string;
  }[];
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ downloadItems }) => {
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
        {downloadItems.map((item) => (
          <TooltipProvider key={item.key}>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  className="border-transparent text-left text-xs underline"
                  variant="outline"
                >
                  <Link href={item.href} className="text-center text-sm">
                    {item.text}
                  </Link>
                </Badge>
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
