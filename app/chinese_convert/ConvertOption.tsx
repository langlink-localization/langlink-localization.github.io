import React, { useState, useEffect } from "react";
import { Button, Select, SelectItem, SelectSection } from "@nextui-org/react";

interface ConvertOptionProps {
  onOptionChange: (languages: [string, string]) => void;
}

const ConvertOption: React.FC<ConvertOptionProps> = ({ onOptionChange }) => {
  // 状态管理原文和目标语言的选择
  const [origLanguage, setOrigLanguage] = useState("cn");
  const [targetLanguage, setTargetLanguage] = useState("hk");

  // 获取转换选项
  useEffect(() => {
    onOptionChange([origLanguage, targetLanguage]);
  }, [origLanguage, targetLanguage, onOptionChange]);

  return (
    <div className="col-span-2 mt-4 grid grid-cols-4 grid-rows-1">
      <Select
        label="选择原文语言"
        placeholder="请选择一个语言"
        value={origLanguage}
        onChange={(e) => setOrigLanguage(e.target.value)}
        size="sm"
        variant="bordered"
        defaultSelectedKeys={["cn"]}
        className="col-span-1 col-start-1"
      >
        <SelectSection showDivider title="简中">
          <SelectItem key="cn">zh-cn</SelectItem>
        </SelectSection>
        <SelectSection showDivider title="繁中">
          <SelectItem key="hk">zh-hk</SelectItem>
          <SelectItem key="tw">zh-tw</SelectItem>
          <SelectItem key="twp">zh-tw+twphrase</SelectItem>
        </SelectSection>
      </Select>
      <Select
        label="选择目标语言"
        placeholder="请选择一个语言"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        size="sm"
        variant="bordered"
        defaultSelectedKeys={["hk"]}
        className="col-span-1 col-start-2"
      >
        <SelectSection showDivider title="简中">
          <SelectItem key="cn">zh-cn</SelectItem>
        </SelectSection>
        <SelectSection showDivider title="繁中">
          <SelectItem key="hk">zh-hk</SelectItem>
          <SelectItem key="tw">zh-tw</SelectItem>
          <SelectItem key="twp">zh-tw+twprase</SelectItem>
        </SelectSection>
      </Select>
      <div className="col-span-2 col-start-3 flex">
        <Button
          className=" place-self-center text-xs"
          radius="md"
          color="primary"
          size="sm"
        >
          转换并展示表格
        </Button>
        <Button
          className=" place-self-center text-xs"
          radius="md"
          color="primary"
          size="sm"
        >
          直接创建下载链接
        </Button>
      </div>
    </div>
  );
};

export default ConvertOption;
