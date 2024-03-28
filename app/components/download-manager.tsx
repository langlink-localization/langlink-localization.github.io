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
  heightClass: string;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({
  downloadItems,
  buttonText,
  tooltipText,
  heightClass,
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
    <div className='col-span-1 mb-8'>
      <div className='text-center'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className='rounded-lg text-xs md:text-sm'
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
      <div
        className={`mt-2 text-pretty ${heightClass} border mx-1 rounded border-input`}
      >
        {downloadItems.length === 0 ? (
          <div
            className={`${heightClass} place-content-center bg-transparent`}
          />
        ) : (
          downloadItems.map((item) => (
            <ul key={item.key}>
              <TooltipProvider key={item.key}>
                <Tooltip>
                  <TooltipTrigger>
                    <li
                      className='text-tiny border-transparent text-left underline hover:text-blue-500 lg:text-xs'
                      onClick={() => downloadOne(item)}
                    >
                      {item.text}
                    </li>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.text}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </ul>
          ))
        )}
      </div>
    </div>
  );
};

export default DownloadManager;
