import frontMatter from 'front-matter';
import { marked } from 'marked';
import type { Entity, EntityAttributes, HTMLString } from '$lib/@types';
import TableExtension from './table';
import EntityExtension from './entity';
import ParagraphExtension from './paragraph';
import HighlightExtension from './highlight';
import FootnoteExtension from './footnote';

class ParseService {
  entities = new Map<string, string>();
  protected entityExtension: EntityExtension;
  protected footnoteExtension: FootnoteExtension;

  constructor() {
    this.entityExtension = new EntityExtension(this);
    this.footnoteExtension = new FootnoteExtension();

    marked.use(TableExtension);
    marked.use(this.entityExtension.extension);
    marked.use(ParagraphExtension);
    marked.use(HighlightExtension);
    marked.use(this.footnoteExtension.extension);
  }

  parse<Attributes = EntityAttributes>(source: string, urlPath: string) {
    this.entityExtension.startParsing(urlPath);
    this.footnoteExtension.startParsing();

    const { attributes, body: markdown } = frontMatter<Attributes>(source);
    const body = marked.parse(markdown, { smartypants: true });

    const footnotes = this.footnoteExtension.endParsing();
    const links = new Set(this.entityExtension.endParsing());

    return { attributes, body: (body + footnotes) as HTMLString, links };
  }

  updateEntities(entities: Iterable<Entity>) {
    this.entities = new Map(Array.from(entities).map(({ name, urlPath }) => [name, urlPath]));
  }
}

const parseService = new ParseService();
export default parseService;
export { ParseService };
