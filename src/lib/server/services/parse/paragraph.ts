import type { marked } from 'marked';

const ParagraphExtension: marked.MarkedExtension = {
  /**
   * ブラウザはHTML中の改行をスペースに置き換えてしまうが、日本語の文章には望ましくない挙動である。
   * 仕方ないので、改行を含めないように事前に書き換える。
   */
  walkTokens(token) {
    if (token.type === 'paragraph') {
      for (const child of token.tokens) {
        if (child.type === 'text') {
          child.text = child.text.replace(/(?<=[、。，．）」』】])\n/g, '');
        }
      }
    }
  },
  extensions: [
    {
      name: 'paragraph',
      level: 'block',
      renderer: function (token: marked.Tokens.Paragraph): string | false {
        if (token.tokens.length === 0) {
          return false;
        }

        if (token.tokens[0].type === 'html') {
          if (token.tokens[0].raw.startsWith('<x-script')) {
            return this.parser.parseInline(token.tokens, this.parser.renderer);
          }
        } else if (
          (token.tokens[0].type === 'link' &&
            token.tokens[0].tokens.length === 1 &&
            token.tokens[0].tokens[0].type === 'image') ||
          token.tokens[0].type === 'image'
        ) {
          const [figure, ...caption] = token.tokens;

          if (caption.length > 0) {
            return (
              '<figure title="クリックで拡大">' +
              this.parser.parseInline([figure], this.parser.renderer) +
              '<figcaption>' +
              this.parser.parseInline(caption, this.parser.renderer) +
              '</figcaption></figure>'
            );
          } else {
            return '<figure>' + this.parser.parseInline(token.tokens, this.parser.renderer) + '</figure>';
          }
        }

        return false;
      } as marked.RendererExtension['renderer'],
    },
  ],
};

export default ParagraphExtension;
