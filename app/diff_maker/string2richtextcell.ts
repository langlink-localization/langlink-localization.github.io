export const string2RichTextCell = (str: string) => {
  const words = str.split(/(<span.*?<\/span>)/);
  const richText = [];

  for (const word of words) {
    if (word.startsWith('<span class="text-red"')) {
      richText.push({
        t: word.replace(/<span.*?>(.*?)<\/span>/, "$1"),
        s: {
          color: { rgb: "FF0000" },
        },
      });
    } else if (word.startsWith('<span class="text-sky"')) {
      richText.push({
        t: word.replace(/<span.*?>(.*?)<\/span>/, "$1"),
        s: {
          color: { rgb: "00FFFF" },
        },
      });
    } else {
      richText.push({ t: word });
    }
  }

  return {
    t: "s",
    r: richText,
  };
};
