import { error } from '@sveltejs/kit';
import { EntityService } from '$lib/server/services';

export function load({ url }) {
  const entity = EntityService.get(url.pathname.replace(/\/+$/, ''));

  if (!entity) {
    error(404);
  }

  return { entity };
}
