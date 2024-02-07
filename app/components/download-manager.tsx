// DownloadManager.tsx
import React from "react";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "@/components/ListboxWrapper";

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
    <ListboxWrapper>
      <Listbox color="primary" variant="bordered">
        <ListboxSection>
          {downloadItems.map((item) => (
            <ListboxItem
              key={item.key}
              className="text-center hover:underline"
              download={item.download}
              href={item.href}
            >
              {item.text}
            </ListboxItem>
          ))}
        </ListboxSection>
      </Listbox>
    </ListboxWrapper>
  );
};

export default DownloadManager;
