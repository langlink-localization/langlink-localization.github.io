interface XliffData {
  fileName: string;
  id: number;
  source: string;
  target: string;
  convertResult: string;
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
      const source = unit.getElementsByTagName("source")[0]?.textContent ?? "";
      const target = unit.getElementsByTagName("target")[0]?.textContent ?? "";
      if (id) {
        data.push({
          fileName,
          id: Number(id),
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
