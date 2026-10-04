import { execFileSync } from 'node:child_process';

const assignmentPattern = /\b(?:[A-Z0-9_]*(?:PASSWORD|PASSWD|SECRET|TOKEN)|API[_-]?KEY)\b\s*[:=]\s*["']?([^\s"'#]+)/i;
const tokenPatterns = [
  /-----BEGIN(?: [A-Z0-9]+)* PRIVATE KEY-----/,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
  /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
];

function isPlaceholder(value) {
  return /^\$\{[^}]+\}$/.test(value)
    || /^<[^>]+>$/.test(value)
    || /^(?:change|replace|your|example|placeholder|dummy)[-_]/i.test(value);
}

function containsSecret(line) {
  if (tokenPatterns.some(pattern => pattern.test(line))) return true;
  const match = assignmentPattern.exec(line);
  return Boolean(match && match[1].length >= 12 && !isPlaceholder(match[1]));
}

function runSelfTest() {
  const fakeValue = ['FCV', 'SYNTHETIC', 'ONLY', 'TEST', '2026'].join('_');
  const fakeAssignment = `JWT_ACCESS_SECRET=${fakeValue}`;
  const interpolation = 'JWT_ACCESS_SECRET=$' + '{JWT_ACCESS_SECRET}';
  if (!containsSecret(fakeAssignment) || containsSecret(interpolation)) {
    console.error('FAIL: secret scanner self-test.');
    process.exit(1);
  }
  console.log('PASS: fake secret blocked; environment interpolation allowed.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
} else {
  try {
    const stagedFiles = execFileSync('git', [
      'diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z',
    ], { encoding: 'utf8' }).split('\0').filter(Boolean);
    let blocked = false;

    for (const file of stagedFiles) {
      const name = file.split(/[\\/]/).at(-1);
      if (name === '.env' || (name.startsWith('.env.') && name !== '.env.example')) {
        console.error(`Blocked staged environment file: ${file}`);
        blocked = true;
      }
    }

    const diff = execFileSync('git', [
      'diff', '--cached', '--no-ext-diff', '--unified=0',
    ], { encoding: 'utf8' });
    let currentFile = 'staged content';
    for (const line of diff.split(/\r?\n/)) {
      if (line.startsWith('+++ b/')) currentFile = line.slice(6);
      if (line.startsWith('+') && !line.startsWith('+++') && containsSecret(line.slice(1))) {
        console.error(`Blocked potential secret in staged additions: ${currentFile}`);
        blocked = true;
      }
    }

    if (blocked) process.exit(1);
    console.log('Secret scan passed.');
  } catch {
    console.error('Secret scan could not run; commit blocked.');
    process.exit(2);
  }
}