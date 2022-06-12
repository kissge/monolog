import type { RequestHandler } from './__types/all';
import type { JSON } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = () => ({ body: { all: EntityService.allPaths } });

interface Body {
  all: string[];
}
export type APIResponse = JSON<Body>;
