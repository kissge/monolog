export interface NoteAttributes {
  title: string;
  date: Date;
  tags?: string[];

  /** ヘッダ画像のパス、またはURL */
  header?: string;
  /** 別のブログシステムから移植してきた場合、そのソース */
  from?: string;
}
