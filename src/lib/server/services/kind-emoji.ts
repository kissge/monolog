import fs from 'node:fs';
import * as Config from '$lib/config';
import { AutoReloadUtility, JSONUtility } from '$lib/utilities';

class KindEmojiService extends AutoReloadUtility.AutoReloadable {
  #emojis!: { kind: string; emoji: string }[];

  static readonly autoReloadTargets = ['all', 'CSS'] satisfies (keyof KindEmojiService)[];

  get all() {
    return this.#emojis;
  }

  initialize() {
    this.#emojis = Object.entries(
      JSONUtility.parseAs<Record<string, string>>(
        fs.readFileSync(`${Config.dataRootDir}/kinds.json`, { encoding: 'utf-8' }),
        {},
      ),
    ).map(([kind, emoji]) => ({ kind, emoji }));
  }

  get CSS() {
    return this.all
      .map(({ kind, emoji }) => {
        const selector = kind === 'default' ? '' : `[data-kind="${kind}"]`;
        return `${selector} .viewer-header h1::before, .tag${selector}::before, .links .monolog-link${selector}::before { content: '${emoji}' }`;
      })
      .join('');
  }
}

export default AutoReloadUtility.autoReload(new KindEmojiService());
