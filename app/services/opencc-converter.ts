import * as OpenCC from "opencc-js";

export const openCCConverter = (
  text: string,
  config: { from: string; to: string },
  customDict: [string, string][],
): string => {
  const converter = OpenCC.Converter(config as OpenCC.ConverterOptions);
  const customConverter = OpenCC.CustomConverter(customDict);
  try {
    let convertedText = converter(text);
    customDict.length > 0
      ? (convertedText = customConverter(convertedText))
      : convertedText;
    return convertedText;
  } catch (error) {
    console.error(`转换文本时出错: ${error}`);
    return "";
  }
};
