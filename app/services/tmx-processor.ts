interface TmxData {
  fileName: string;
  id: number;
  percent: string;
  source: string;
  target: string;
}

const repalceHtmlEscapes = (str: string) => {
  const escapeMap: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, (m) => escapeMap[m]);
};

export const tmxProcessor = async (
  fileName: string,
  content: string,
): Promise<TmxData[]> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");

    let fileNameInFile =
      xmlDoc
        .getElementsByTagName("header")[0]
        ?.getElementsByTagName(`prop type="name"`)[0]?.textContent || "N/A";

    if (fileNameInFile !== "N/A" && fileNameInFile !== fileName) {
      fileName = fileNameInFile;
    }

    let transUnits = xmlDoc.querySelectorAll("tu");
    const data: TmxData[] = [];
    transUnits.forEach((unit, index) => {
      let source =
        unit.getElementsByTagName("tuv")[0]?.getElementsByTagName("seg")[0]
          ?.textContent || "N/A";
      let target =
        unit.getElementsByTagName("tuv")[1]?.getElementsByTagName("seg")[0]
          ?.textContent || "N/A";
      let replacedSource = repalceHtmlEscapes(source);
      let replacedTarget = repalceHtmlEscapes(target);
      if (source) {
        data.push({
          fileName,
          id: Number(index + 1),
          percent: "N/A",
          source: replacedSource,
          target: replacedTarget,
        });
      }
    });

    return data;
  } catch (error) {
    console.error(`处理Xliff文件时出错: ${error}`);
    return [];
  }
};
