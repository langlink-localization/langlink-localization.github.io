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
      oldHtml += `<span class="text-red-600 underline underline-offset-[3px] decoration-dotted
 dark:text-red-400">${part.value}</span>`;
      isSame = "不同";
    } else if (part.added) {
      newHtml += `<span class="text-sky-600 underline underline-offset-[3px]
 dark:text-sky-400">${part.value}</span>`;

      isSame = "不同";
    } else {
      const commonHtml = `<span>${part.value}</span>`;
      oldHtml += commonHtml;
      newHtml += commonHtml;
    }
  });

  return { oldHtml, newHtml, isSame };
};
