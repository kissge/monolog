import type { RequestHandler } from './__types/[...entity]';
import type { EntityWithBody, JSON } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = ({ url }) => {
  const entity = EntityService.get(url.pathname.replace(/\/+$/, ''));

  return entity ? { body: { entity } } : { status: 404 };
};

interface Body {
  entity: EntityWithBody;
}
export type APIResponse = JSON<Body>;
