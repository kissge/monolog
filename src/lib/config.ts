const Config = {
  dataRootDir: assertNonEmptyString(import.meta.env.VITE_DATA_ROOT_DIR),
  dataGitHubRepo: assertNonEmptyString(import.meta.env.VITE_DATA_GITHUB_REPO),
  maxDepthForTopPage: assertInteger(import.meta.env.VITE_MAX_DEPTH_FOR_TOP_PAGE),
};

function assertNonEmptyString(value: unknown): string {
  if (typeof value !== 'string' || !value) {
    throw new Error();
  }

  return value;
}

function assertInteger(value: unknown): number {
  const parsed = Number.parseInt(value as string);
  if (Number.isNaN(parsed)) {
    throw new Error();
  }

  return parsed;
}

export default Config;
export type Config = typeof Config;
