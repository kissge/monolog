import { AssertionUtility, JSONUtility } from './utilities';

export const siteTitle = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_SITE_TITLE);
export const siteHostname = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_SITE_HOSTNAME);
export const dataRootDir = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_DATA_ROOT_DIR);
export const dataGitHubRepo = AssertionUtility.assertNonEmptyString(import.meta.env.VITE_DATA_GITHUB_REPO);
export const dataIgnoredFiles = JSONUtility.parseAs<string[]>(import.meta.env.VITE_DATA_IGNORED_FILES, []);
export const navLinks = JSONUtility.parseAs<{ href: string; title: string }[]>(import.meta.env.VITE_NAV_LINKS, [
  { href: '/', title: siteTitle },
  { href: '/timeline', title: 'timeline' },
  { href: '/about', title: 'about' },
]);
export const topTags = JSONUtility.parseAs<string[]>(import.meta.env.VITE_TOP_TAGS, []);
export const birthday = new Date(AssertionUtility.assertNonEmptyString(import.meta.env.VITE_BIRTHDAY)).getTime();
export const twitterID: string | undefined = import.meta.env.VITE_TWITTER_ID;
export const githubID: string | undefined = import.meta.env.VITE_GITHUB_ID;
export const googleAnalyticsID: string | undefined = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
export const googleAdSenseID: string | undefined = import.meta.env.VITE_GOOGLE_ADSENSE_ID;
