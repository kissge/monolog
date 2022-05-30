import type { RequestHandler } from '../mono/__types/[name]';
import type { JSON, MonoWithBody } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = ({ url }) => {
  const entity = EntityService.get<MonoWithBody>(url.pathname);

  return entity ? { body: entity } : { status: 404 };
};

type Body = MonoWithBody;
export type APIResponse = JSON<Body>;
