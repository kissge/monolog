import { EntityService } from '$lib/server/services';

export function load() {
  return {
    timeline: EntityService.timeline,
  };
}
