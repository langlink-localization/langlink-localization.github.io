import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";

interface UploadManagerProps {
  onFilesUploaded: (filesData: { name: string; content: string }[]) => void;
  buttonText: string;
  tooltipText: string;
  heightClass: string;
}

const UploadManager: React.FC<UploadManagerProps> = ({
  onFilesUploaded,
  buttonText,
  tooltipText,
  heightClass,
}) => {
  const [upldFilesData, setUpldFilesData] = useState<
    { key: string; name: string; content?: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFilesContent = (files: File[]) => {
    const fileReaders = files.map((file) => {
      return new Promise<{ name: string; content: string }>(
        (resolve, reject) => {
          if (file.name.endsWith(".mqxlz")) {
            const zip = new JSZip();
            zip
              .loadAsync(file)
              .then((zip) => {
                zip
                  .file("document.mqxliff")
                  ?.async("string")
                  .then((content) => {
                    resolve({
                      name: file.name.replace(".mqxlz", ".mqxliff"),
                      content: content,
                    });
                  })
                  .catch(reject);
              })
              .catch(reject);
          } else {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                name: file.name,
                content: event.target?.result as string,
              });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
          }
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
    const files = event.target?.files as FileList;
    if (!files || files.length === 0) return;

    readFilesContent(Array.from(files));

    event.target.value = ""; // 清空input的值
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click(); // 触发input的点击事件
  };

  const handleCloseFileIcon = (key: string) => {
    setUpldFilesData((prev) => {
      const updatedFiles = prev.filter((item) => item.key !== key);
      const filesWithContent = updatedFiles
        .filter((file) => file.content !== undefined)
        .map((file) => ({ name: file.name, content: file.content || "" }));

      onFilesUploaded(filesWithContent);
      return updatedFiles;
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    readFilesContent(Array.from(files));
  };

  return (
    <div className="col-span-1 mb-8">
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
              <Button
                className="rounded-lg text-xs md:text-sm"
                onClick={triggerFileInputClick}
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
      <div className={`mt-2 text-pretty ${heightClass} border-2 border-dotted`}>
        {upldFilesData.length === 0 ? (
          <div
            className={`bg-transparent ${heightClass} place-content-center`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInputClick}
          >
            <div className="text-center">
              <span>将文件拖放到此处，或者</span>
              <span className="text-primary cursor-pointer underline">
                点击上传
              </span>
            </div>
          </div>
        ) : (
          upldFilesData.map((item) => (
            <ul key={item.key}>
              <TooltipProvider key={item.key}>
                <Tooltip>
                  <TooltipTrigger>
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <li className="text-tiny border-transparent text-left lg:text-xs">
                          {item.name}{" "}
                          <span className="text-tiny text-gray-600">
                            右键删除
                          </span>{" "}
                        </li>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          inset
                          className="justify-items-center"
                          onClick={() => handleCloseFileIcon(item.key)}
                        >
                          <span className="text-xs lg:text-sm">删除</span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.name}</p>
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

export default UploadManager;
