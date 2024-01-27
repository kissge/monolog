import { EntityService } from '$lib/server/services';

export function load() {
  return {
    notes: EntityService.notes,
    groups: EntityService.groups,
    tags: EntityService.tags,
  };
}
