import assert from 'node:assert/strict';
import type { marked } from 'marked';
import type { ParseService } from '.';
import { cleanUrl } from './marked';

export default class EntityExtension {
  constructor(protected service: ParseService) {}

  protected state = {
    parsing: false,
    selfUrlPath: '',
    linkTargets: new Set<string>(),
    links: [] as string[],
  };

  get extension(): marked.MarkedExtension {
    const self = this;

    return {
      walkTokens: (token) => {
        assert.equal(this.state.parsing, true);

        if (
          ['heading', 'blockquote', 'paragraph', 'text', 'strong', 'em', 'del'].includes(token.type) &&
          'tokens' in token
        ) {
          this.rewriteBlock(token);
        } else if (token.type === 'table') {
          for (const th of token.header) {
            this.rewriteBlock(th);
          }
          for (const tr of token.rows) {
            for (const td of tr) {
              this.rewriteBlock(td);
            }
          }
        }
      },
      extensions: [
        {
          name: 'link',
          level: 'inline',
          renderer: function (token: marked.Tokens.Link): string | false {
            assert.equal(self.state.parsing, true);

            const urlPath = token.href.replace(/\/$/, '');

            if (self.state.linkTargets.has(urlPath)) {
              self.state.links.push(urlPath);

              const href = cleanUrl(
                this.parser.options.sanitize ?? false,
                this.parser.options.baseUrl ?? '',
                token.href,
              );
              const text = this.parser.parseInline(token.tokens, this.parser.renderer);
              if (href === null) {
                return text;
              }

              const internalLink = href.startsWith('/');
              const attrs = [
                'href="' + href + '"',
                internalLink ? 'class="monolog-link"' : 'class="monolog-external-link"',
                internalLink ? '' : 'rel="external"',
              ];

              if (token.title) {
                attrs.push('title="' + token.title + '"');
              }

              return '<a ' + attrs.join(' ') + '>' + text + '</a>';
            }

            return false;
          } as marked.RendererExtension['renderer'],
        },
      ],
    };
  }

  startParsing(urlPath: string) {
    assert.equal(this.state.parsing, false);
    this.state = {
      parsing: true,
      selfUrlPath: urlPath,
      linkTargets: new Set(this.service.entities.values()),
      links: [],
    };
  }

  endParsing() {
    assert.equal(this.state.parsing, true);
    this.state.parsing = false;
    return this.state.links;
  }

  protected rewriteBlock(token: { tokens?: marked.Token[] }) {
    if (!token.tokens) {
      return;
    }

    for (const [entityName, href] of this.service.entities) {
      if (href === this.state.selfUrlPath) {
        continue;
      }

      let noLink = false;

      token.tokens = token.tokens.flatMap((token) => {
        if (token.type === 'text' && !noLink) {
          assert.equal('tokens' in token, false, JSON.stringify(token));

          if (token.text.includes(entityName)) {
            return token.text.split(entityName).flatMap<marked.Token>((chunk, i, all) => {
              if (i === 0) {
                return { type: 'text', raw: 'n/a', text: chunk };
              } else if (
                /[a-z0-9-_]{2}/i.test(all[i - 1].slice(-1) + entityName.charAt(0)) ||
                /[a-z0-9-_]{2}/i.test(entityName.slice(-1) + chunk.charAt(0))
              ) {
                // e.g. 「SvelteKit」に対して「Svelte」のリンクはつけない
                return { type: 'text', raw: 'n/a', text: entityName + chunk };
              } else {
                return [
                  {
                    type: 'link',
                    raw: entityName,
                    href,
                    title: entityName,
                    text: entityName,
                    tokens: [{ type: 'text', raw: 'n/a', text: entityName }],
                  },
                  { type: 'text', raw: 'n/a', text: chunk },
                ];
              }
            });
          }
        }

        if (token.type === 'html') {
          if (token.text.match(/^<kbd[^>]*>/)) {
            noLink = true;
            return token;
          }

          if (token.text.match(/^<\/kbd>/)) {
            noLink = false;
            return token;
          }
        }

        if ('inLink' in token) {
          noLink = token.inLink;
        }

        return token;
      });
    }
  }
}
