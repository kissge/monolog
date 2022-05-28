const Config = {
  dataRootDir: assertNonEmptyString(import.meta.env.VITE_DATA_ROOT_DIR),
  dataGitHubRepo: assertNonEmptyString(import.meta.env.VITE_DATA_GITHUB_REPO),
};

function assertNonEmptyString(value: unknown): string {
  if (typeof value !== 'string' || !value) {
    throw new Error();
  }

  return value;
}

export default Config;
