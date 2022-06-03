import type { marked } from 'marked';

const ParagraphExtension: marked.MarkedExtension = {
  extensions: [
    {
      name: 'paragraph',
      level: 'block',
      renderer(_token) {
        const token = _token as marked.Tokens.Paragraph;

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
              '<figure>' +
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
      },
    },
  ],
};

export default ParagraphExtension;
