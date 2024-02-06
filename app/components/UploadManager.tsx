import React, { useState, useRef } from "react";
import { Button, Tooltip, Chip } from "@nextui-org/react";

interface UploadManagerProps {
  onFilesUploaded: (files: File[]) => void; // 用于处理上传文件
}

const UploadManager: React.FC<UploadManagerProps> = ({ onFilesUploaded }) => {
  const [filesData, setFilesData] = useState<{ key: string; text: string }[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFilesData = Array.from(files).map((file, index) => ({
      key: `uploadFile-${index}`,
      text: file.name,
    }));

    setFilesData(newFilesData);
    onFilesUploaded(Array.from(files));
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click(); // 触发input的点击事件
  };

  const handleCloseFileChip = (key: string) => {
    setFilesData((prev) => prev.filter((item) => item.key !== key));
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
      <div className="row-start-2">
        {filesData.map((item) => (
          <Tooltip
            key={item.key}
            content={item.text}
            placement="top-start"
            showArrow={true}
            delay={1000}
            size="sm"
          >
            <Chip
              key={item.key}
              className=""
              variant="faded"
              onClose={() => handleCloseFileChip(item.key)}
            >
              {item.text}
            </Chip>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default UploadManager;
