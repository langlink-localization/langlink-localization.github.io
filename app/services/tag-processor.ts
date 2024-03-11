interface tagConvertedResult {
  grayedString: string;
  shortenedString: string;
}

export const tagProcessor = (oldText: string): tagConvertedResult => {
  const tagRegex = /<(\/?)(?:ph|bpt|ept|it|mrk|a)([^>]*)>/gm;

  let grayedString = oldText.replace(
    tagRegex,
    `<span class="bg-gray-200">$1</span>`,
  );

  let shortenedString = oldText.replace(
    tagRegex,
    `<span class="bg-gray-200">⬣</span>`,
  );

  return { grayedString, shortenedString };
};
