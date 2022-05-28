import fs from 'fs';

export function* listMarkdownFilesRecursive(
  rootDirPath: string,
  dirPath?: string,
): Generator<{ name: string; path: string }> {
  for (const file of fs.readdirSync(rootDirPath + '/' + (dirPath ?? ''), { withFileTypes: true })) {
    const path = dirPath ? `${dirPath}/${file.name}` : file.name;

    if (file.isDirectory()) {
      yield* listMarkdownFilesRecursive(rootDirPath, path);
    } else if (file.isFile() && file.name.endsWith('.md')) {
      yield { name: file.name.slice(0, -3), path };
    }
  }
}

export function findMarkdownFileRecursive(rootDirPath: string, fileName: string, dirPath?: string) {
  for (const file of listMarkdownFilesRecursive(rootDirPath, dirPath)) {
    if (file.name === fileName) {
      return file;
    }
  }
}
