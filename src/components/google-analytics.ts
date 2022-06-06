import * as Config from '$lib/config';

declare const window: {
  dataLayer: (string | Date)[][];
  gtag: (...args: (string | Date)[]) => void;
};

export function initGoogleAnalytics() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !Config.googleAnalyticsID) {
    return;
  }

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${Config.googleAnalyticsID}`;
  document.head.appendChild(script);

  window.dataLayer ??= [];
  window.gtag ??= (...args: (string | Date)[]) => window.dataLayer.push(args);

  window.gtag('js', new Date());
  window.gtag('config', Config.googleAnalyticsID);
}
