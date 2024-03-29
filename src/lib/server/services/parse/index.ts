import frontMatter from 'front-matter';
import { marked } from 'marked';
import TableExtension from './table';
import EntityExtension from './entity';
import ParagraphExtension from './paragraph';
import HighlightExtension from './highlight';
import FootnoteExtension from './footnote';
import type { Entity, EntityAttributes, HTMLString } from '$lib/@types';

class ParseService {
  entities = new Map<string, string>();
  protected entityExtension: EntityExtension;
  protected footnoteExtension: FootnoteExtension;

  constructor() {
    this.entityExtension = new EntityExtension(this);
    this.footnoteExtension = new FootnoteExtension();

    marked.use(marked.getDefaults());
    marked.use(TableExtension);
    marked.use(this.entityExtension.extension);
    marked.use(ParagraphExtension);
    marked.use(HighlightExtension);
    marked.use(this.footnoteExtension.extension);
  }

  parse<Attributes extends EntityAttributes>(source: string, urlPath: string) {
    const { attributes, body: markdown } = frontMatter<Attributes>(source);

    const resolvedUrlPath = attributes.external || attributes.urlPath || urlPath;

    this.entityExtension.startParsing(resolvedUrlPath);
    this.footnoteExtension.startParsing();

    const body = marked.parse(markdown, { smartypants: true });

    const footnotes = this.footnoteExtension.endParsing();
    const links = new Set(this.entityExtension.endParsing());

    return { attributes, body: (body + footnotes) as HTMLString, links, resolvedUrlPath };
  }

  updateEntities(entities: Iterable<Entity>) {
    this.entities = new Map(
      Array.from(entities)
        .filter(({ name }) => name.trim())
        .map<[string, string]>(({ name, urlPath }) => [name, urlPath])
        // Sort by length (longest first), for longest match
        .sort(([a], [b]) => b.length - a.length),
    );
  }
}

export default new ParseService();
export { ParseService };
