import { dev } from '$app/env';
import type { RequestHandler } from './__types/kind-emoji.css';
import { KindEmojiService } from '$lib/services';

export const get: RequestHandler<string> = () => ({
  headers: { 'Content-Type': 'text/css' },
  body:
    KindEmojiService.all
      .map(({ kind, emoji }) => {
        const selector = kind === 'default' ? '' : `[data-kind="${kind}"]`;
        return `${selector} .viewer-header h1::before, .tag${selector}::before { content: '${emoji}' }`;
      })
      .join('') + (dev ? '/*' + new Date() + '*/' : ''),
});
