import React, { useState, useRef } from "react";
import {
  Listbox,
  ListboxSection,
  ListboxItem,
  Button,
} from "@nextui-org/react";

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
      key: `file-${index}`,
      text: file.name,
    }));

    setFilesData(newFilesData);
    onFilesUploaded(Array.from(files));
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click(); // 触发input的点击事件
  };

  return (
    <div className="col-span-1 col-start-1 grid grid-rows-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      ></input>
      <Button
        className="align-self-end row-span-1 row-start-1"
        radius="full"
        color="primary"
        onClick={triggerFileInputClick}
      >
        上传文件
      </Button>

      <Listbox
        color="primary"
        variant="bordered"
        className="rows-start-2 row-span-1"
      >
        <ListboxSection>
          {filesData.map((item) => (
            <ListboxItem key={item.key} className="text-center">
              {item.text}
            </ListboxItem>
          ))}
        </ListboxSection>
      </Listbox>
    </div>
  );
};

export default UploadManager;
