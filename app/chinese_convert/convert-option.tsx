import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectTrigger,
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
    <div className="col-span-2 mt-2 grid grid-cols-4 grid-rows-1 gap-2">
      <Select
        value={origLanguage}
        onValueChange={(newValue) => setOrigLanguage(newValue)}
        defaultValue={"cn"}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择原文语言" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>简中</SelectLabel>
            <SelectItem value="cn">zh-cn</SelectItem>
            <SelectLabel>繁中</SelectLabel>
            <SelectItem value="hk">zh-hk</SelectItem>
            <SelectItem value="tw">zh-tw</SelectItem>
            <SelectItem value="twp">zh-tw+twphrase</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={targetLanguage}
        onValueChange={(newValue) => setTargetLanguage(newValue)}
        defaultValue={"hk"}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择目标语言" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>简中</SelectLabel>
            <SelectItem value="cn">zh-cn</SelectItem>
            <SelectLabel>繁中</SelectLabel>
            <SelectItem value="hk">zh-hk</SelectItem>
            <SelectItem value="tw">zh-tw</SelectItem>
            <SelectItem value="twp">zh-tw+twprase</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="col-span-2 col-start-3 ml-4 flex gap-3">
        <Button className=" place-self-center text-xs">转换并展示表格</Button>
        <Button className=" place-self-center text-xs">直接创建下载链接</Button>
      </div>
    </div>
  );
};

export default ConvertOption;
