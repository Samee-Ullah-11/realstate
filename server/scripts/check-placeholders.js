// Lists every remaining placeholder in the repo and exits non-zero if any
// exist, so unfinished content cannot ship by accident.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const PATTERNS = [/\[FILL IN[^\]]*\]/g, /\[UR REVIEW[^\]]*\]/g, /\[AGENT PHOTO\]/g];
const SCAN_DIRS = ['server', 'client/src', 'client/index.html'];
const IGNORE = new Set(['node_modules', 'dist', '.git']);
const SELF = path.join('server', 'scripts', 'check-placeholders.js');

let hits = 0;

function scanFile(filePath) {
  const relative = path.relative(ROOT, filePath);
  if (relative === SELF) return;
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  lines.forEach((lineText, i) => {
    for (const pattern of PATTERNS) {
      pattern.lastIndex = 0;
      const match = pattern.exec(lineText);
      if (match) {
        hits += 1;
        console.log(`${relative}:${i + 1}  ${match[0]}`);
      }
    }
  });
}

function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return scanFile(target);
  for (const entry of fs.readdirSync(target)) {
    if (IGNORE.has(entry)) continue;
    walk(path.join(target, entry));
  }
}

for (const dir of SCAN_DIRS) {
  const target = path.join(ROOT, dir);
  if (fs.existsSync(target)) walk(target);
}

if (hits) {
  console.error(`\n${hits} placeholder(s) remaining. Fix them before launch.`);
  process.exit(1);
}
console.log('No placeholders found.');
