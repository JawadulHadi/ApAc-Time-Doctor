const { existsSync, readdirSync, statSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const CONFIG = {
  ignoreDirs: [
    'node_modules',
    'dist',
    'coverage',
    '.git',
    '.roo',
    '.vscode',
    '.gemini',
    'uploads',
    'test-reports',
  ],
  ignoreFiles: ['package-lock.json', '.env', 'structure.txt', '.DS_Store', 'Thumbs.db'],
  outputFile: 'structure.txt',
};

function generateDirectoryStructure(
  dir: string,
  prefix: string = '',
  output: string[] = [],
): string[] {
  if (!existsSync(dir)) return output;

  const items = readdirSync(dir);

  const filteredItems = items
    .filter(item => {
      const itemPath = join(dir, item);
      const isDir = statSync(itemPath).isDirectory();
      return isDir ? !CONFIG.ignoreDirs.includes(item) : !CONFIG.ignoreFiles.includes(item);
    })
    .sort((a, b) => {
      const aPath = join(dir, a);
      const bPath = join(dir, b);
      const aIsDir = statSync(aPath).isDirectory();
      const bIsDir = statSync(bPath).isDirectory();

      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

  filteredItems.forEach((item, index) => {
    const fullPath = join(dir, item);
    const isLast = index === filteredItems.length - 1;
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      output.push(`${prefix}${isLast ? '└── ' : '├── '}${item}/`);
      generateDirectoryStructure(fullPath, `${prefix}${isLast ? '    ' : '│   '}`, output);
    } else {
      output.push(`${prefix}${isLast ? '└── ' : '├── '}${item}`);
    }
  });

  return output;
}

function main() {
  const targetDir = process.argv[2] || '.';
  const absoluteTargetDir = resolve(targetDir);

  console.log(`Generating structure for: ${absoluteTargetDir}`);

  const structure = generateDirectoryStructure(targetDir);
  writeFileSync(CONFIG.outputFile, structure.join('\n'));

  console.log(`Structure saved to ${CONFIG.outputFile}`);
  console.log(`Total items processed: ${structure.length}`);
}

main();
