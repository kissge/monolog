import * as Config from '$lib/config';

export function initGoogleAdSense() {
  if (typeof document === 'undefined' || !Config.googleAdSenseID) {
    return;
  }

  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${Config.googleAdSenseID}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}
