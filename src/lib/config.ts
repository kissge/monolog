import { AssertionUtility } from './utilities';

export const siteTitle = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_SITE_TITLE);
export const dataRootDir = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_DATA_ROOT_DIR);
export const dataGitHubRepo = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_DATA_GITHUB_REPO);
export const dataIgnoredFiles = JSONParseAs<string[]>(import.meta.env.VITE_DATA_IGNORED_FILES || '"[]"');
export const maxDepthForTopPage = AssertionUtility.assertInteger(import.meta.env.VITE_MAX_DEPTH_FOR_TOP_PAGE);
export const navLinks = JSONParseAs<{ href: string; title: string }[]>(import.meta.env.VITE_NAV_LINKS || '"[]"');
export const topTags = JSONParseAs<string[]>(import.meta.env.VITE_TOP_TAGS || '"[]"');
export const twitterID: string | undefined = import.meta.env.VITE_TWITTER_ID;
export const googleAnalyticsID: string | undefined = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
export const googleAdSenseID: string | undefined = import.meta.env.VITE_GOOGLE_ADSENSE_ID;

function JSONParseAs<T>(json: string): T {
  return /* @__PURE__ */ JSON.parse(json);
}
