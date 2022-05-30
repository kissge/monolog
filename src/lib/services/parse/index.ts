import frontMatter from 'front-matter';
import { marked } from 'marked';
import type { Entity, HTMLString } from '$lib/@types';
import TableExtension from './table';
import EntityExtension from './entity';

class ParseService {
  entities = new Map<string, string>();

  constructor() {
    marked.use(TableExtension);
    marked.use(EntityExtension(this));
  }

  parse<Attributes>(source: string) {
    const { attributes, body } = frontMatter<Attributes>(source);
    return { attributes, body: marked.parse(body, { smartypants: true }) as HTMLString };
  }

  updateEntities(entities: Iterable<Entity>) {
    this.entities = new Map(Array.from(entities).map(({ name, urlPath }) => [name, urlPath]));
  }
}

const parseService = new ParseService();
export default parseService;
export { ParseService };
