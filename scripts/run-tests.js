const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function findTestFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findTestFiles(fullPath));
    } else if (file.endsWith('.test.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const testDir = path.join(__dirname, '..', 'dist', 'test');
const testFiles = findTestFiles(testDir);

if (testFiles.length === 0) {
  console.error(`DevUtils test runner: No test files found in ${testDir}`);
  process.exit(1);
}

const res = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit'
});

process.exit(res.status ?? 0);
