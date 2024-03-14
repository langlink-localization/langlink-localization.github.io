interface XliffData {
  fileName: string;
  id: number;
  percent: string;
  source: string;
  target: string;
}

export const xliffProcessor = async (
  fileName: string,
  content: string,
): Promise<XliffData[]> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    let transUnits = xmlDoc.querySelectorAll("unit, trans-unit");
    const data: XliffData[] = [];
    transUnits.forEach((unit, index) => {
      let id = unit.getAttribute("id");
      let percent =
        unit.getAttribute("percent") ||
        unit.getAttribute("mq:percent") ||
        "N/A";
      let source = unit.getElementsByTagName("source")[0]?.textContent || "";
      let target = unit.getElementsByTagName("target")[0]?.textContent || "";
      if (id) {
        data.push({
          fileName,
          id: Number(index + 1),
          percent,
          source,
          target,
        });
      }
    });
    return data;
  } catch (error) {
    console.error(`处理Xliff文件时出错: ${error}`);
    return [];
  }
};
