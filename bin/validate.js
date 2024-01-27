// @ts-check

import fs from 'node:fs';
import frontMatter from 'front-matter';
import { createProject, ts } from '@ts-morph/bootstrap';

const interfaces = [
  fs.readFileSync('src/lib/@types/entity.ts', 'utf-8'),
  fs.readFileSync('src/lib/@types/note.ts', 'utf-8'),
].map((source) => source.replace(/^import.*/g, ''));

Promise.all(
  process.argv.slice(2).map(async (path) => {
    const attributesType = path.includes('/notes/') ? 'NoteAttributes' : 'EntityAttributes';
    const source = fs.readFileSync(path, 'utf-8');
    const { attributes } = frontMatter(source);

    const project = await createProject({ useInMemoryFileSystem: true });

    project.createSourceFile(
      'test.ts',
      [
        'type HTMLString = string;',
        ...interfaces,
        'const attributes: ' + attributesType + ' = ' + JSON.stringify(attributes) + ';',
      ].join('\n'),
    );

    const diagnostics = ts.getPreEmitDiagnostics(
      project.createProgram({ rootNames: ['test.ts'], options: { strict: true } }),
    );

    for (const diagnostic of diagnostics) {
      console.log(stringify({ path, ...parseDiagnostic(diagnostic) }));
    }

    return diagnostics.length > 0;
  }),
).then((results) => process.exit(results.some((result) => result) ? 1 : 0));

/** @param {ts.Diagnostic} diagnostic */
function parseDiagnostic({ code, messageText, relatedInformation }) {
  if (code === 2322) {
    if (relatedInformation?.length === 1 && typeof relatedInformation[0].messageText === 'string') {
      const match1 = (typeof messageText === 'string' ? messageText : messageText.messageText).match(
        /^Type '(.+)' is not assignable to type '(.+)'\.$/,
      );
      const match2 = relatedInformation[0].messageText.match(
        /^The expected type comes from property '(.+)' which is declared here on type '.+'$/,
      );

      if (match1 && match2) {
        return {
          key: match2[1],
          desc: `Expected ${match1[2]}, but got ${match1[1]}`,
        };
      }
    } else if (typeof messageText !== 'string' && messageText.next?.every(({ code }) => code === 2353)) {
      const matches = messageText.next.map(({ messageText }) =>
        messageText.match(
          /^Object literal may only specify known properties, and '"?(.+?)"?' does not exist in type '.+'\.$/,
        ),
      );

      if (matches.every((match) => match)) {
        return {
          key: matches.map((match) => /** @type {RegExpMatchArray} */ (match)[1]),
          desc: 'Unknown property',
        };
      }
    }
  } else if (code === 2741) {
    if (typeof messageText === 'string') {
      const match = messageText.match(/^Property '(.+)' is missing in type '.+' but required in type '.+'\.$/);

      if (match) {
        return {
          key: match[1],
          desc: 'Required but missing',
        };
      }
    }
  }

  return { code, messageText, relatedInformation };
}

/** @param {unknown} obj */
function stringify(obj) {
  try {
    return JSON.stringify(obj, null, 4);
  } catch {
    return obj;
  }
}
