/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EntityWithBody, Entity } from '$lib/@types';

export function strip<Attributes>({
  body,
  links,
  source,
  ...entityWithoutBody
}: EntityWithBody<Attributes> & { source?: string }): Entity<Attributes> {
  return entityWithoutBody;
}
