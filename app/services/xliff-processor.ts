interface XliffData {
  fileName: string;
  id: number;
  percent: string;
  source: string;
  target: string;
}

export const processXliffString = async (
  fileName: string,
  content: string,
): Promise<XliffData[]> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const transUnits = xmlDoc.querySelectorAll("unit, trans-unit");
    const data: XliffData[] = [];
    transUnits.forEach((unit) => {
      const id = unit.getAttribute("id");
      const percent =
        unit.getAttribute("percent") ||
        unit.getAttribute("mq:percent") ||
        "N/A";
      const source = unit.getElementsByTagName("source")[0]?.textContent || "";
      const target = unit.getElementsByTagName("target")[0]?.textContent || "";
      if (id) {
        data.push({
          fileName,
          id: Number(id),
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
