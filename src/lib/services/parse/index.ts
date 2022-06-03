import frontMatter from 'front-matter';
import { marked } from 'marked';
import type { Entity, HTMLString } from '$lib/@types';
import TableExtension from './table';
import EntityExtension from './entity';
import ParagraphExtension from './paragraph';

class ParseService {
  entities = new Map<string, string>();
  protected entityExtension: EntityExtension;

  constructor() {
    this.entityExtension = new EntityExtension(this);
    marked.use(TableExtension);
    marked.use(this.entityExtension.extension);
    marked.use(ParagraphExtension);
  }

  parse<Attributes>(source: string, urlPath: string) {
    this.entityExtension.startParsing(urlPath);

    const { attributes, body: markdown } = frontMatter<Attributes>(source);
    const body = marked.parse(markdown, { smartypants: true }) as HTMLString;

    const links = new Set(this.entityExtension.endParsing());

    return { attributes, body, links };
  }

  updateEntities(entities: Iterable<Entity>) {
    this.entities = new Map(Array.from(entities).map(({ name, urlPath }) => [name, urlPath]));
  }
}

const parseService = new ParseService();
export default parseService;
export { ParseService };
