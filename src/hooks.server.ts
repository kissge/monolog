import { dev } from '$app/environment';
import { KindEmojiService } from '$lib/server/services';
import * as Config from '$lib/config';

export function handle({ event, resolve }) {
  return resolve(event, {
    transformPageChunk({ html }) {
      const injected = [
        `<style>${KindEmojiService.CSS}</style>`,
        `<meta property="og:site_name" content=${Config.siteTitle} />`,
      ];

      if (Config.googleAnalyticsID && !dev) {
        injected.push(
          `<script defer src="https://www.googletagmanager.com/gtag/js?id=${Config.googleAnalyticsID}"></script>`,
          '<script defer>',
          'window.dataLayer ??= [];',
          'function gtag(){ window.dataLayer.push(arguments); }',
          'gtag("js", new Date());',
          `gtag("config", "${Config.googleAnalyticsID}", { user_id: localStorage.getItem("uid") || void 0 });`,
          '</script>',
        );
      }

      if (Config.googleAdSenseID && !dev) {
        injected.push(
          `<script defer src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${Config.googleAdSenseID}" crossorigin="anonymous"></script>`,
        );
      }

      if (Config.twitterID) {
        injected.push(
          `<link href="https://twitter.com/${Config.twitterID}" rel="me" />`,
          `<link rel="webmention" href="https://webmention.io/${Config.siteHostname}/webmention" />`,
          `<link rel="pingback" href="https://webmention.io/${Config.siteHostname}/xmlrpc" />`,
        );
      }

      if (Config.githubID) {
        injected.push(`<link href="https://github.com/${Config.githubID}" rel="me" />`);
      }

      return html.replace('%monolog.head%', injected.join(''));
    },
  });
}
