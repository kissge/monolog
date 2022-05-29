import type { RequestHandler } from '../mono/__types/[name]';
import type { EntityWithBody, JSON } from '$lib/@types';
import Config from '$lib/config';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = ({ params: { name } }) => {
  const entity = EntityService.findEntityRecursive(Config.dataRootDir, name);

  if (!entity) {
    return { status: 404 };
  }

  return {
    body: {
      ...entity,
      name,
      historyURL: `https://github.com/${Config.dataGitHubRepo}/commits/master/${entity.path}`,
    },
  };
};

interface Body extends EntityWithBody {
  name: string;
  historyURL: string;
}
export type APIResponse = JSON<Body>;