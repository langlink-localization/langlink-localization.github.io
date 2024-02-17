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
  SelectSeparator,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ConvertOptionProps {
  onOptionChange: (languages: [string, string]) => void;
}

const ConvertOption: React.FC<ConvertOptionProps> = ({ onOptionChange }) => {
  // 状态管理原文和目标语言的选择
  const [origLanguage, setOrigLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  // 获取转换选项
  useEffect(() => {
    onOptionChange([origLanguage, targetLanguage]);
  }, [origLanguage, targetLanguage, onOptionChange]);

  return (
    <div className="col-span-1 mt-2 grid grid-cols-8 grid-rows-1 gap-2">
      <Select
        value={origLanguage}
        onValueChange={(newValue) => setOrigLanguage(newValue)}
      >
        <SelectTrigger>
          <Label>原文语言</Label>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>简中</SelectLabel>
            <SelectItem value="cn">zh-cn</SelectItem>
            <SelectSeparator />
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
      >
        <SelectTrigger>
          <Label>目标语言</Label>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>简中</SelectLabel>
            <SelectItem value="cn">zh-cn</SelectItem>
            <SelectSeparator />
            <SelectLabel>繁中</SelectLabel>
            <SelectItem value="hk">zh-hk</SelectItem>
            <SelectItem value="tw">zh-tw</SelectItem>
            <SelectItem value="twp">zh-tw+twprase</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="col-span-2 col-start-3 flex gap-3">
        <Button className=" place-self-center text-sm">转换并展示表格</Button>
        <Button className=" place-self-center text-sm">直接创建下载链接</Button>
      </div>
    </div>
  );
};

export default ConvertOption;
