import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const cli = path.join(root, 'cli', 'ziwei.ts');

function run(args: string[]) {
  return spawnSync(process.execPath, [tsxCli, cli, ...args], {
    encoding: 'utf8',
    timeout: 20000,
  });
}

test('chart 命令输出本命盘基本信息', () => {
  const res = run(['chart', '1990', '1', '1', '12', 'female']);
  assert.equal(res.status, 0);
  assert.match(res.stdout, /紫微斗数命盘/);
  assert.match(res.stdout, /性别：女/);
});

test('monthly 命令输出流月推运', () => {
  const res = run(['monthly', '1990', '1', '1', '12', 'female', '2026', '7']);
  assert.equal(res.status, 0);
  assert.match(res.stdout, /流月推运/);
  assert.match(res.stdout, /流月：2026年7月/);
});

test('now --json 输出可解析 JSON', () => {
  const res = run(['now', '1990', '1', '1', '12', 'female', '--json']);
  assert.equal(res.status, 0);
  const data = JSON.parse(res.stdout);
  assert.equal(data.command, 'now');
  assert.equal(data.birth.gender, '女');
});

test('非法出生日期返回非零并提示', () => {
  const res = run(['chart', '2020', '2', '30', '12', 'male']);
  assert.notEqual(res.status, 0);
  assert.match(res.stderr, /出生日期无效/);
});

test('非法性别返回非零并提示', () => {
  const res = run(['chart', '2020', '1', '1', '12', 'xyz']);
  assert.notEqual(res.status, 0);
  assert.match(res.stderr, /无效性别/);
});

test('bin wrapper 对错误参数只执行一次并返回非零', () => {
  const res = spawnSync(
    process.execPath,
    [path.join(root, 'bin', 'ziwei.cjs'), 'chart', '2020', '2', '30', '12', 'male'],
    { encoding: 'utf8', timeout: 30000 },
  );
  assert.notEqual(res.status, 0);
  const hits = (res.stderr.match(/出生日期无效/g) || []).length;
  assert.equal(hits, 1);
  assert.match(res.stderr, /用法：ziwei chart/);
});

