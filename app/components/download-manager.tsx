// DownloadManager.tsx
import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface DownloadManagerProps {
  downloadItems: {
    key: string;
    content: string;
    text: string;
    href: string;
    download: string;
  }[];
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ downloadItems }) => {
  const downloadAll = () => {
    const zip = new JSZip();
    downloadItems.forEach((item) => {
      zip.file(item.text, item.content)
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "allFiles.zip");
    });
  };

  return (
    <div className="col-span-1 col-start-2 mb-8 overflow-auto">
      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="rounded-lg text-xs md:text-sm" onClick={downloadAll}>
                下载所有文件
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>点击下载所有文件</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
       <div className="mt-4 h-40 md:h-56">
        {downloadItems.length === 0 ? (
          <Skeleton className="h-40 bg-transparent md:h-56" />
        ) : (
          downloadItems.map((item) => (
            <TooltipProvider key={item.key}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className="text-tiny border-transparent text-left underline lg:text-xs"
                    variant="outline"
                  >
                    <Link
                      href={item.href}
                      className="text-tiny lg:text-xs hover:text-blue-600"
                      download={item.download}
                    >
                      {item.text}
                    </Link>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.text}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        )}
      </div>
    </div>
  );
};

export default DownloadManager;
