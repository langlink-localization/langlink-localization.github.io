import { diffChars, diffWords, diffLines, Change } from "diff";

type DiffMethod = "chars" | "words" | "lines";

export class DiffMaker {
  static diff(
    text1: string,
    text2: string,
    method: DiffMethod = "chars",
  ): Change[] {
    switch (method) {
      case "chars":
        return diffChars(text1, text2);
      case "words":
        return diffWords(text1, text2);
      case "lines":
        return diffLines(text1, text2);
      default:
        return diffChars(text1, text2);
    }
  }
}
