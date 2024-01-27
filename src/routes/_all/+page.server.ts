import { EntityService } from '$lib/server/services';

export function load() {
  return { allPaths: EntityService.allPaths };
}
