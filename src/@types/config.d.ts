declare interface Config {
  /** Absolute path to data directory */
  dataRootDir: string;

  /** GitHub repository for data */
  dataGitHubRepo: string;

  /** Site title (used in <title>) */
  title: string;

  /** Google Analytics tracking ID */
  googleAnalyticsTrackingID: string;
}
