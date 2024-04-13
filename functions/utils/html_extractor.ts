class TextExtractorHandler {
  private _text: string[];

  constructor() {
    this._text = [];
  }

  getText() {
    const temp = this._text
      .filter((x) => x.length > 1)
      .join("\n")
      .trim();
    return temp.replace(/\n /gm, "\n").replace(/\n\n/gm, "\n");
  }

  text(text) {
    this._text.push(text.text);
  }
}

export async function extractTextFromHTML(res: Response): Promise<string> {
  const handler = new TextExtractorHandler();
  await new HTMLRewriter()
    .on("#article-show-container > div.crayons-article__main", handler)
    .transform(res)
    .text();

  return handler.getText();
}
