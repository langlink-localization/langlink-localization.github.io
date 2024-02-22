import { OpenCC } from "opencc";

export const openCCConverter = async (
  text: string,
  config: string,
): Promise<string> => {
  const opencc = new OpenCC(config);
  try {
    const convertedText = await opencc.convertPromise(text);
    return convertedText;
  } catch (error) {
    console.error(`转换文本时出错: ${error}`);
    return "";
  }
};
