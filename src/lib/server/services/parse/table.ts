import type { marked } from 'marked';

interface TableCell extends marked.Tokens.TableCell {
  rowspan: number;
}

const TableExtension: marked.MarkedExtension = {
  walkTokens(token) {
    if (token.type === 'table') {
      const rows: TableCell[][] = token.rows.map(() => []);

      for (const [x] of token.header.entries()) {
        for (let y = token.rows.length - 1; y >= 0; --y) {
          let rowspan = 1;
          while (y > 0 && token.rows[y][x].tokens.length === 0) {
            ++rowspan;
            --y;
          }

          rows[y].push({ ...token.rows[y][x], rowspan });
        }
      }

      token.rows = rows;
    }
  },
  extensions: [
    {
      name: 'table',
      level: 'block',
      renderer: function (token: marked.Tokens.Table): string | false {
        const header = this.parser.renderer.tablerow(
          token.header
            .map(({ tokens }, x) =>
              this.parser.renderer.tablecell(this.parser.parseInline(tokens, this.parser.renderer), {
                header: true,
                align: token.align[x],
              }),
            )
            .join(''),
        );

        const body = (token.rows as TableCell[][])
          .map((row) =>
            this.parser.renderer.tablerow(
              row
                .map(
                  ({ tokens, rowspan }, x) =>
                    [
                      '<td',
                      ...(token.align[x] ? [`align="${token.align[x]}"`] : []),
                      ...(rowspan > 1 ? [`rowspan="${rowspan}"`] : []),
                    ].join(' ') +
                    '>' +
                    this.parser.parseInline(tokens, this.parser.renderer) +
                    '</td>',
                )
                .join(''),
            ),
          )
          .join('');

        return '<div class="table-wrapper">' + this.parser.renderer.table(header, body) + '</div>';
      } as marked.RendererExtension['renderer'],
    },
    {
      name: 'html',
      level: 'block',
      renderer: function (token) {
        if (token.text.startsWith('<table')) {
          return '<div class="table-wrapper">' + token.text + '</div>';
        }

        return false;
      },
    },
  ],
};

export default TableExtension;
