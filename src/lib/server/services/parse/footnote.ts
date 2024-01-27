import assert from 'node:assert/strict';
import { marked } from 'marked';

export default class FootnoteExtension {
  protected state = {
    parsing: false,
    footnotes: [] as string[],
  };

  get extension(): marked.MarkedExtension {
    const self = this;

    return {
      extensions: [
        {
          name: 'footnote',
          level: 'inline',
          tokenizer(src) {
            assert.equal(self.state.parsing, true);

            const match = src.match(/^\^\[([^\]]*)\]/);

            if (match) {
              const id = self.state.footnotes.push(match[1].trim());

              return {
                type: 'html',
                raw: match[0],
                text:
                  '<sup class="footnote-link">' +
                  `<a href="#footnote-${id}" id="footnote-link-${id}">[${id}]` +
                  '</a></sup>',
              };
            }
          },
          start: function (src: string): number | undefined {
            return src.match(/\^\[([^\]]*)\]/)?.index;
          } as marked.TokenizerExtension['start'],
        },
      ],
    };
  }

  startParsing() {
    assert.equal(this.state.parsing, false);
    this.state = { parsing: true, footnotes: [] };
  }

  endParsing() {
    assert.equal(this.state.parsing, true);

    if (this.state.footnotes.length === 0) {
      this.state.parsing = false;
      return '';
    }

    const footnotes = this.state.footnotes.map(
      (src, i) =>
        `<li id="footnote-${i + 1}">` +
        marked.parseInline(src) +
        ` <a href="#footnote-link-${i + 1}" title="本文にもどる">↩︎</a></li>`,
    );
    this.state.parsing = false;

    return '<section class="footnotes"><ol>' + footnotes.join('') + '</ol></section>';
  }
}
