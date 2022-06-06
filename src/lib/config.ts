import { AssertionUtility } from './utilities';

export const siteTitle = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_SITE_TITLE);
export const dataRootDir = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_DATA_ROOT_DIR);
export const dataGitHubRepo = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_DATA_GITHUB_REPO);
export const maxDepthForTopPage = AssertionUtility.assertInteger(import.meta.env.VITE_MAX_DEPTH_FOR_TOP_PAGE);
export const navLinks = JSON.parse(import.meta.env.VITE_NAV_LINKS || '"[]"') as { href: string; title: string }[];
export const topTags = /* @__PURE__ */ JSON.parse(import.meta.env.VITE_TOP_TAGS || '"[]"') as string[];
export const twitterID = import.meta.env.VITE_TWITTER_ID as string | undefined;
export const googleAnalyticsID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID as string | undefined;
