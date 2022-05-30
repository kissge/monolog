import assert from 'node:assert/strict';
import { marked } from 'marked';
import { cleanUrl } from '$lib/vendor/helpers';

let entityNames: string[] = [];
export function updateEntityNames(newEntityNames: string[]) {
  entityNames = newEntityNames;
}

marked.use({
  walkTokens(token) {
    if (
      ['heading', 'blockquote', 'paragraph', 'text', 'strong', 'em', 'del'].includes(token.type) &&
      'tokens' in token
    ) {
      rewriteBlock(token);
    } else if (token.type === 'table') {
      for (const th of token.header) {
        rewriteBlock(th);
      }
      for (const tr of token.rows) {
        for (const td of tr) {
          rewriteBlock(td);
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
});

function rewriteBlock(token: { tokens?: marked.Token[] }) {
  if (!token.tokens) {
    return;
  }

  for (const entityName of entityNames) {
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
                  href: '/mono/' + entityName,
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
