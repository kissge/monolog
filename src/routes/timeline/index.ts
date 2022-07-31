import type { RequestHandler } from './__types/index';
import type { EntityWithDate, JSON } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = () => ({
  body: {
    timeline: EntityService.timeline,
  },
});

interface Body {
  timeline: { age: number; entities: EntityWithDate[] }[];
}
export type APIResponse = JSON<Body>;
