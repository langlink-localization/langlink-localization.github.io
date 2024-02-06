import React, { useState, useRef } from "react";
import { Button, Tooltip, Chip } from "@nextui-org/react";
import uuid from 'uuid';

interface UploadManagerProps {
  onFilesUploaded: (filesData: { name: string; content: string }[]) => void; // 用于处理上传文件
}

const UploadManager: React.FC<UploadManagerProps> = ({ onFilesUploaded }) => {
  const [upldFilesData, setupldFilesData] = useState<
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
        setupldFilesData(
          filesData.map((file) => ({
            key: uuidFromUuid(),
            name: file.name,
            content: file.content,
          })),
        );
        onFilesUploaded(filesData);
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  const uuidFromUuid = () => {
    const newUuid = uuid.v4();
    return newUuid;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files as FileList; // 结合使用可选链和类型断言
    if (!files) return;

    readFilesContent(Array.from(files));
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click(); // 触发input的点击事件
  };

  const handleCloseFileChip = (key: string) => {
    setupldFilesData((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <div className="col-span-1 col-start-1 overflow-auto">
      <div className="text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        ></input>
        <Tooltip content="上传文件" showArrow={true}>
          <Button
            className=""
            radius="full"
            color="primary"
            onClick={triggerFileInputClick}
          >
            上传文件
          </Button>
        </Tooltip>
      </div>
      <div className="">
        {upldFilesData.map((item) => (
          <Tooltip
            key={item.key}
            content={item.name}
            placement="top-start"
            showArrow={true}
            delay={1000}
            size="sm"
          >
            <Chip
              key={item.key}
              className=""
              variant="dot"
              onClose={() => handleCloseFileChip(item.key)}
            >
              {item.name}
            </Chip>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default UploadManager;
