import * as Config from '$lib/config';

declare const window: { dataLayer: unknown[] };

export function initGoogleAnalytics() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !Config.googleAnalyticsID) {
    return;
  }

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${Config.googleAnalyticsID}`;
  document.head.appendChild(script);

  window.dataLayer ??= [];

  function gtag(...args: unknown[]): void;
  function gtag() {
    // GA4 is apparently checking if values are Arguments instances *vomit*
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('config', Config.googleAnalyticsID, { user_id: localStorage.getItem('uid') || undefined });
}
