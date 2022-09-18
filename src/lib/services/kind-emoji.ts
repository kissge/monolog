import fs from 'node:fs';
import * as Config from '$lib/config';
import { AutoReload, AutoReloadable, JSONUtility } from '$lib/utilities';

class KindEmojiService extends AutoReloadable {
  protected emojis!: { kind: string; emoji: string }[];

  @AutoReload()
  get all() {
    return this.emojis;
  }

  initialize() {
    this.emojis = Object.entries(
      JSONUtility.parseAs<Record<string, string>>(
        fs.readFileSync(`${Config.dataRootDir}/kinds.json`, { encoding: 'utf-8' }),
        {},
      ),
    ).map(([kind, emoji]) => ({ kind, emoji }));
  }
}

export default new KindEmojiService();
