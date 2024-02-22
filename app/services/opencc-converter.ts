import * as OpenCC from "opencc-js";

export const openCCConverter = (
  text: string,
  config: { from: string; to: string },
): string => {
  const converter = OpenCC.Converter(config as OpenCC.ConverterOptions);
  try {
    const convertedText = converter(text);
    return convertedText;
  } catch (error) {
    console.error(`转换文本时出错: ${error}`);
    return "";
  }
};
