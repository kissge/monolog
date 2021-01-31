declare interface Config {
  /** Absolute path to data directory */
  dataRootDir: string;

  /** GitHub repository for data */
  dataGitHubRepo: string;

  /** e.g. https://example.com */
  host: string;

  /** Site title (used in <title>) */
  title: string;

  /** Twitter ID */
  twitter: string;

  /** Google Analytics tracking ID */
  googleAnalyticsTrackingID: string;
}
