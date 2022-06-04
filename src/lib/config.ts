const Config = {
  siteTitle: assertNonEmptyString(import.meta.env.VITE_SITE_TITLE),
  dataRootDir: assertNonEmptyString(import.meta.env.VITE_DATA_ROOT_DIR),
  dataGitHubRepo: assertNonEmptyString(import.meta.env.VITE_DATA_GITHUB_REPO),
  maxDepthForTopPage: assertInteger(import.meta.env.VITE_MAX_DEPTH_FOR_TOP_PAGE),
  navLinks: JSON.parse(import.meta.env.VITE_NAV_LINKS || '"[]"') as { href: string; title: string }[],
  topTags: JSON.parse(import.meta.env.VITE_TOP_TAGS || '"[]"') as string[],
  twitterID: import.meta.env.VITE_TWITTER_ID as string | undefined,
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
