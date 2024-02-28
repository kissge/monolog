import { EntityService } from '$lib/server/services';

export function GET({ url }) {
  EntityService.initialize();
  const entity = EntityService.get(url.pathname.replace(/\/_reload\/*$/, ''));

  return new Response(JSON.stringify({ entity }));
}
