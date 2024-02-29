import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ConvertOptionProps {
  onOptionChange: (config: { from: string; to: string }) => void;
}

const languageOptions = [
  { label: "简中", value: "cn" },
  { label: "繁中 (香港)", value: "hk" },
  { label: "繁中 (台湾)", value: "tw" },
  { label: "繁中 (台湾，含短语)", value: "twp" },
];

const ConvertOption: React.FC<ConvertOptionProps> = ({ onOptionChange }) => {
  // 状态管理原文和目标语言的选择
  const [origLanguage, setOrigLanguage] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("");

  useEffect(() => {
    const generateConfig = (): { from: string; to: string } => {
      if (origLanguage && targetLanguage) {
        const config = { from: origLanguage, to: targetLanguage };
        return config;
      } else {
        return { from: "", to: "" };
      }
    };
    onOptionChange(generateConfig());
  }, [origLanguage, targetLanguage, onOptionChange]);

  return (
    <div className="col-span-4 col-start-1 grid grid-cols-6 grid-rows-1 gap-2">
      <div className="relative col-span-3 col-start-1">
        <Select
          value={origLanguage}
          onValueChange={(newValue) => setOrigLanguage(newValue)}
        >
          <SelectTrigger>
            <Label className="absolute -top-6 text-sm">原文语言</Label>
            <SelectValue placeholder="请选择一个选项" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {languageOptions.map((option) =>
                targetLanguage === option.value ? (
                  <SelectItem
                    className="text-sm"
                    key={option.value}
                    value={option.value}
                    disabled
                  >
                    {option.label}
                    <p className="text-sm">前后语言不能相同</p>
                  </SelectItem>
                ) : (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ),
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="relative col-span-3 col-start-4">
        <Select
          value={targetLanguage}
          onValueChange={(newValue) => setTargetLanguage(newValue)}
        >
          <SelectTrigger>
            <Label className="absolute -top-6 text-sm">目标语言</Label>
            <SelectValue placeholder="请选择一个选项" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {languageOptions.map((option) =>
                origLanguage === option.value ? (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled
                    className="text-sm"
                  >
                    {option.label}
                    <p>前后语言不能相同</p>
                  </SelectItem>
                ) : (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ),
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConvertOption;
