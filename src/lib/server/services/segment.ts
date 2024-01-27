import { loadDefaultJapaneseParser } from 'budoux';

export class SegmentService {
  protected parser = loadDefaultJapaneseParser();

  segment(text: string) {
    const segments = this.parser.parse(text, 1);
    for (let i = segments.length - 1; i > 0; --i) {
      if (
        ['）', '？'].includes(segments[i]) ||
        ['（', ' (', '「'].includes(segments[i - 1]) ||
        (/^[\w:;,.!?]/.test(segments[i]) && /[\w(]$/.test(segments[i - 1]))
      ) {
        segments[i - 1] += segments[i];
        segments.splice(i, 1);
      }
    }

    return segments;
  }
}

export default new SegmentService();
