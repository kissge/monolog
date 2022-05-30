import assert from 'node:assert/strict';
import type { marked } from 'marked';
import { cleanUrl } from '$lib/vendor/helpers';
import type { ParseService } from '.';

export default function EntityExtension(service: ParseService): marked.MarkedExtension {
  return {
    walkTokens(token) {
      if (
        ['heading', 'blockquote', 'paragraph', 'text', 'strong', 'em', 'del'].includes(token.type) &&
        'tokens' in token
      ) {
        rewriteBlock(token, service.entities);
      } else if (token.type === 'table') {
        for (const th of token.header) {
          rewriteBlock(th, service.entities);
        }
        for (const tr of token.rows) {
          for (const td of tr) {
            rewriteBlock(td, service.entities);
          }
        }
      }
    },
    extensions: [
      {
        name: 'link',
        level: 'inline',
        renderer: function (this, token: marked.Tokens.Link & { mono?: true }): string | false {
          if (token.mono) {
            const href = cleanUrl(this.parser.options.sanitize ?? false, this.parser.options.baseUrl ?? '', token.href);
            const text = this.parser.parseInline(token.tokens, this.parser.renderer);
            if (href === null) {
              return text;
            }

            return `<a href="${href}" class="mono-link" sveltekit:prefetch${
              token.title ? ' title="' + token.title + '"' : ''
            }>${text}</a>`;
          }

          return false;
        } as marked.RendererExtension['renderer'],
      },
    ],
  };
}

function rewriteBlock(token: { tokens?: marked.Token[] }, entities: Map<string, string>) {
  if (!token.tokens) {
    return;
  }

  for (const [entityName, href] of entities) {
    token.tokens = token.tokens.flatMap((token) => {
      if (token.type === 'text') {
        assert.equal('tokens' in token, false, JSON.stringify(token));

        if (token.raw.includes(entityName)) {
          return token.raw.split(entityName).flatMap((chunk, i) => {
            if (i === 0) {
              return { type: 'text', raw: chunk, text: chunk } as marked.Token;
            } else {
              return [
                {
                  type: 'link',
                  raw: entityName,
                  href,
                  title: entityName,
                  text: entityName,
                  tokens: [{ type: 'text', raw: entityName, text: entityName }],
                  mono: true,
                },
                { type: 'text', raw: chunk, text: chunk },
              ] as marked.Token[];
            }
          });
        }
      }

      return token;
    });
  }
}
