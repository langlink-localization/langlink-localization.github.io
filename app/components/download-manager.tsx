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

interface DownloadManagerProps {
  downloadItems: {
    key: string;
    content: string;
    text: string;
  }[];
  buttonText: string;
  tooltipText: string;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({
  downloadItems,
  buttonText,
  tooltipText,
}) => {
  const downloadAll = () => {
    const zip = new JSZip();
    downloadItems.forEach((item) => {
      zip.file(item.text, item.content);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "allFiles.zip");
    });
  };

  const downloadOne = (item: { content: string; text: string }) => {
    const blob = new Blob([item.content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, item.text);
  };

  return (
    <div className="col-span-1 col-start-2 mb-8 overflow-auto">
      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="rounded-lg text-xs md:text-sm"
                onClick={downloadAll}
                disabled={downloadItems.length === 0}
              >
                {buttonText}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
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
                    className="text-tiny border-transparent text-left underline hover:text-blue-500 lg:text-xs"
                    variant="outline"
                    onClick={() => downloadOne(item)}
                  >
                    {item.text}
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
