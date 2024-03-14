// DiffProcessor.ts
import { diffChars, diffWords, diffLines, Change } from "diff";

type DiffMethod = "chars" | "words" | "lines";

interface DiffResult {
  oldHtml: string;
  newHtml: string;
  isSame: string;
}

export const diff2Html = (
  oldText: string,
  newText: string,
  method: DiffMethod = "chars",
): DiffResult => {
  let diffResult: Change[];

  switch (method) {
    case "chars":
      diffResult = diffChars(oldText, newText);
      break;
    case "words":
      diffResult = diffWords(oldText, newText);
      break;
    case "lines":
      diffResult = diffLines(oldText, newText);
      break;
    default:
      diffResult = diffChars(oldText, newText);
  }

  let oldHtml = "";
  let newHtml = "";
  let isSame = "相同";

  diffResult.forEach((part) => {
    if (part.removed) {
      oldHtml += `<span class="bg-red-400 dark:bg-red-600">${part.value}</span>`;
      isSame = "不同";
    } else if (part.added) {
      newHtml += `<span class="bg-emerald-300 dark:bg-emerald-600">${part.value}</span>`;

      isSame = "不同";
    } else {
      const commonHtml = `<span>${part.value}</span>`;
      oldHtml += commonHtml;
      newHtml += commonHtml;
    }
  });

  return { oldHtml, newHtml, isSame };
};
