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
    <div className="col-span-4 col-start-1 grid grid-cols-8 grid-rows-1 gap-2">
      <div className="col-span-3 col-start-1">
        <Select
          value={origLanguage}
          onValueChange={(newValue) => setOrigLanguage(newValue)}
        >
          <SelectTrigger>
            <Label className="text-xs">原文语言</Label>
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
      </div>
      <div className="col-span-3 col-start-4">
        <Select
          value={targetLanguage}
          onValueChange={(newValue) => setTargetLanguage(newValue)}
        >
          <SelectTrigger>
            <Label className="text-xs">目标语言</Label>
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
      </div>
    </div>
  );
};

export default ConvertOption;
