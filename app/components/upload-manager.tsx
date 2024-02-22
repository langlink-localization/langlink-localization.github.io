import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface UploadManagerProps {
  onFilesUploaded: (filesData: { name: string; content: string }[]) => void; // 用于处理上传文件
}

const UploadManager: React.FC<UploadManagerProps> = ({ onFilesUploaded }) => {
  const [upldFilesData, setUpldFilesData] = useState<
    { key: string; name: string; content?: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFilesContent = (files: File[]) => {
    const fileReaders = files.map((file) => {
      return new Promise<{ name: string; content: string }>(
        (resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              name: file.name,
              content: event.target?.result as string,
            });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        },
      );
    });

    Promise.all(fileReaders)
      .then((filesData) => {
        setUpldFilesData(
          filesData.map((file) => ({
            key: file.name,
            name: file.name,
            content: file.content,
          })),
        );
        onFilesUploaded(filesData);
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files as FileList; // 结合使用可选链和类型断言
    if (!files || files.length === 0) return;

    readFilesContent(Array.from(files));

    event.target.value = ""; // 清空input的值
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click(); // 触发input的点击事件
  };

  const handleCloseFileIcon = (key: string) => {
    setUpldFilesData((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <div className="col-span-1 col-start-1 mb-8 overflow-auto">
      <div className="text-center">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        ></Input>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="rounded-lg" onClick={triggerFileInputClick}>
                上传文件
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>点击上传文件</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-4">
        {upldFilesData.length === 0 ? (
          <Skeleton className="h-40 bg-transparent" />
        ) : (
          upldFilesData.map((item) => (
            <TooltipProvider key={item.key}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className="border-transparent text-left text-xs"
                    variant="outline"
                  >
                    {item.name}
                    <X
                      className="ml-2 h-4 w-4 text-red-500"
                      onClick={() => handleCloseFileIcon(item.key)}
                    />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadManager;
