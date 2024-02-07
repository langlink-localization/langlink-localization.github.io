import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

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
        value={origLanguage}
        onValueChange={(e) => setOrigLanguage(e.target.value)}
        defaultValue={"cn"}
      >
        <SelectGroup>
          <SelectLabel>简中</SelectLabel>
          <SelectItem value="cn">zh-cn</SelectItem>

          <SelectLabel>繁中</SelectLabel>
          <SelectItem value="hk">zh-hk</SelectItem>
          <SelectItem value="tw">zh-tw</SelectItem>
          <SelectItem value="twp">zh-tw+twphrase</SelectItem>
        </SelectGroup>
      </Select>
      <Select
        value={targetLanguage}
        onValueChange={(e) => setTargetLanguage(e.target.value)}
        defaultValue={"hk"}
      >
        <SelectGroup>
          <SelectLabel>简中</SelectLabel>
          <SelectItem value="cn">zh-cn</SelectItem>

          <SelectLabel>繁中</SelectLabel>
          <SelectItem value="hk">zh-hk</SelectItem>
          <SelectItem value="tw">zh-tw</SelectItem>
          <SelectItem value="twp">zh-tw+twprase</SelectItem>
        </SelectGroup>
      </Select>
      <div className="col-span-2 col-start-3 flex">
        <Button className=" place-self-center text-xs">转换并展示表格</Button>
        <Button className=" place-self-center text-xs">直接创建下载链接</Button>
      </div>
    </div>
  );
};

export default ConvertOption;
