import fs from 'fs';
import type { RequestHandler } from '../mono/__types/[name]';
import type { JSON } from '$lib/@types';
import Config from '$lib/config';
import { ParseService } from '$lib/services';
import { FileUtility } from '$lib/utilities';

export const get: RequestHandler<Body> = ({ params: { name } }) => {
  const file = FileUtility.findMarkdownFileRecursive(Config.dataRootDir, name);

  if (!file) {
    return { status: 404 };
  }

  return {
    body: {
      ...ParseService.parse(fs.readFileSync(Config.dataRootDir + '/' + file.path, 'utf-8')),
      ...file,
    },
  };
};

interface Body extends ReturnType<typeof ParseService.parse> {
  name: string;
  path: string;
}
export type APIResponse = JSON<Body>;
