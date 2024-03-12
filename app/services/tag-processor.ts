interface tagConvertedResult {
  grayedString: string;
  shortenedString: string;
}

export const tagProcessor = (oldText: string): tagConvertedResult => {
  const tagRegex =
    /<(\/?)(g|x|bx|ex|bpt|ept|ph|it|mrk|cp|pc|sc|ec|sm|em|a|br)([^>]*)>/gm;

  let grayedString = oldText.replace(
    tagRegex,
    `<span class="text-gray-600">&lt;$1$2$3&gt;</span>`,
  );

  let shortenedString = oldText.replace(
    tagRegex,
    `<span class="text-gray-600">⬣</span>`,
  );

  return { grayedString, shortenedString };
};
