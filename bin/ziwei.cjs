#!/usr/bin/env node
"use strict";
// bin wrapper: locate local cli/ziwei.ts and run with tsx if available, else fall back to npx tsx
const { spawnSync } = require('child_process');
const path = require('path');

function tryRun(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  return res.status === 0;
}

const repoRoot = path.join(__dirname, '..');
const scriptPath = path.join(repoRoot, 'cli', 'ziwei.ts');
const argv = process.argv.slice(2);

// Prefer globally installed tsx
if (tryRun('tsx', [scriptPath, ...argv])) process.exit(0);

// Otherwise try npx
if (tryRun('npx', ['--yes', 'tsx', scriptPath, ...argv])) process.exit(0);

console.error('无法找到 tsx（也无法通过 npx 运行）。请先安装 tsx：npm i -g tsx');
process.exit(1);

