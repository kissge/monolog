import type { HTMLString } from '.';

export interface JF2MentionItem {
  author: {
    name: string;
    photo: string;
    url: string;
  };
  url: string;
  published: string | null;
  content?: {
    html?: HTMLString;
    text: string;
  };
  'wm-received': string;
  'wm-property': 'in-reply-to' | 'like-of' | 'repost-of' | 'bookmark-of' | 'mention-of' | 'rsvp';
}
