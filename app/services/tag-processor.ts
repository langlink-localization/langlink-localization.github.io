interface tagConvertedResult {
  grayedString: string;
  shortenedString: string;
}

export const tagProcessor = (oldText: string): tagConvertedResult => {
  const tagRegex =
    /<(\/?)(g|x|bx|ex|bpt|ept|ph|it|mrk|cp|pc|sc|ec|sm|em|a|br|mq:[a-z\-]+|key|span (?!class))([^>]*)>/gm;

  let grayedString = oldText.replace(
    tagRegex,
    `<span class="dark:bg-[#020817] text-fuchsia-600">&lt;$1$2$3&gt;</span>`,
  );

  let shortenedString = oldText.replace(
    tagRegex,
    `<span class="text-fuchsia-600">&lt;$1$2&gt;</span>`,
  );

  return { grayedString, shortenedString };
};
