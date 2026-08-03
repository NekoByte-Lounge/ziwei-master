#!/usr/bin/env node
"use strict";
// bin wrapper: locate local cli/ziwei.ts and run with tsx if available, else fall back to npx tsx
const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const scriptPath = path.join(repoRoot, 'cli', 'ziwei.ts');
const argv = process.argv.slice(2);

// 返回:
//   0                运行成功
//   非 0 number      程序已执行但返回非零（错误应直接透传，不重复执行）
//   'not_found'     命令不存在（ENOENT），可尝试下一个入口
function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  if (res.error) {
    return res.error.code === 'ENOENT' ? 'not_found' : 'error';
  }
  return typeof res.status === 'number' ? res.status : 1;
}

// Prefer globally installed tsx
const r1 = run('tsx', [scriptPath, ...argv]);
if (r1 === 0) process.exit(0);
if (r1 !== 'not_found' && r1 !== 'error') process.exit(r1 || 1);

// Otherwise try npx
const r2 = run('npx', ['--yes', 'tsx', scriptPath, ...argv]);
if (r2 === 0) process.exit(0);

console.error('无法找到 tsx（也无法通过 npx 运行）。请先安装 tsx：npm i -g tsx');
process.exit(1);
