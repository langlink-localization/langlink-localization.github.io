// DiffProcessor.ts
import React from "react";

import { diffChars, diffWords, diffLines, Change } from "diff";

type DiffMethod = "chars" | "words" | "lines";

interface DiffResult {
  original: JSX.Element[];
  modified: JSX.Element[];
  isSame: string;
}

export const diff2Html = (
  originalText: string,
  modifiedText: string,
  method: DiffMethod = "chars",
): DiffResult => {
  let diffResult: Change[];

  switch (method) {
    case "chars":
      diffResult = diffChars(originalText, modifiedText);
      break;
    case "words":
      diffResult = diffWords(originalText, modifiedText);
      break;
    case "lines":
      diffResult = diffLines(originalText, modifiedText);
      break;
    default:
      diffResult = diffChars(originalText, modifiedText);
  }

  const original: JSX.Element[] = [];
  const modified: JSX.Element[] = [];

  let isSame = "相同";

  diffResult.forEach((part, index) => {
    if (part.removed) {
      original.push(
        <span key={index} className="bg-red-300 line-through">
          {part.value}
        </span>,
      );

      isSame = "不同";
    } else if (part.added) {
      modified.push(
        <span key={index} className="bg-green-300 underline">
          {part.value}
        </span>,
      );

      isSame = "不同";
    } else {
      const element = <span key={index}>{part.value}</span>;
      original.push(element);
      modified.push(element);
    }
  });

  return { original, modified, isSame };
};
