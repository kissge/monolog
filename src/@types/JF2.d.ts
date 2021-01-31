declare interface JF2 {
  type: string;
  name: string;
  children: Child[];
}

declare interface Child {
  type: ChildType;
  author: Author;
  url: string;
  published: string;
  'wm-received': string;
  'wm-id': number;
  'wm-source': string;
  'wm-target': string;
  content: Content;
  'mention-of': string;
  'wm-property': WmProperty;
  'wm-private': boolean;
}

declare interface Author {
  type: AuthorType;
  name: string;
  photo: string;
  url: string;
}

declare enum AuthorType {
  Card = 'card',
}

declare interface Content {
  html: string;
  text: string;
}

declare enum ChildType {
  Entry = 'entry',
}

declare enum WmProperty {
  MentionOf = 'mention-of',
}
