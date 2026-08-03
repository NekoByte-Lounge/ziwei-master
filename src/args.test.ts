import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractFlags, extractGender, genderFromToken, h2s, isValidHour,
  isValidPlainDate, p2, toInt,
} from './args.js';

test('h2s 小时转时辰边界', () => {
  assert.equal(h2s(0), 0);
  assert.equal(h2s(23), 0);
  assert.equal(h2s(1), 1);
  assert.equal(h2s(12), 6);
  assert.equal(h2s(13), 7);
  assert.equal(h2s(18), 9);
  assert.equal(h2s(22), 11);
});

test('isValidHour 只接受 0-23 的整数', () => {
  assert.equal(isValidHour(0), true);
  assert.equal(isValidHour(23), true);
  assert.equal(isValidHour(24), false);
  assert.equal(isValidHour(-1), false);
  assert.equal(isValidHour(12.5), false);
});

test('isValidPlainDate 校验阳历日期', () => {
  assert.equal(isValidPlainDate(2020, 1, 1), true);
  assert.equal(isValidPlainDate(2020, 2, 28), true);
  assert.equal(isValidPlainDate(2020, 2, 29), true);
  assert.equal(isValidPlainDate(2019, 2, 29), false);
  assert.equal(isValidPlainDate(2020, 13, 1), false);
  assert.equal(isValidPlainDate(2020, 0, 1), false);
  assert.equal(isValidPlainDate(2020, 1, 0), false);
});

test('toInt 只接受完整数字', () => {
  assert.equal(toInt('12'), 12);
  assert.equal(toInt('0'), 0);
  assert.equal(toInt('12abc'), undefined);
  assert.equal(toInt(''), undefined);
  assert.equal(toInt(undefined), undefined);
});

test('p2 补零', () => {
  assert.equal(p2(1), '01');
  assert.equal(p2(12), '12');
});

test('genderFromToken 识别性别写法', () => {
  assert.equal(genderFromToken('male'), '男');
  assert.equal(genderFromToken('Male'), '男');
  assert.equal(genderFromToken('女'), '女');
  assert.equal(genderFromToken('female'), '女');
  assert.equal(genderFromToken('F'), '女');
  assert.equal(genderFromToken('abc'), undefined);
});

test('extractGender 移除性别并保留其余参数', () => {
  assert.deepEqual(
    extractGender(['1990', '1', '1', '12', 'female', '--json']),
    { gender: '女', rest: ['1990', '1', '1', '12', '--json'] },
  );
  assert.deepEqual(
    extractGender(['1990', '1', '1', '12']),
    { gender: '男', rest: ['1990', '1', '1', '12'] },
  );
});

test('extractFlags 识别 --json / --detailed', () => {
  assert.deepEqual(
    extractFlags(['1990', '1', '1', '12', '--json', '--detailed']),
    { json: true, detailed: true, rest: ['1990', '1', '1', '12'] },
  );
  assert.deepEqual(
    extractFlags(['1990', '1', '1', '12']),
    { json: false, detailed: false, rest: ['1990', '1', '1', '12'] },
  );
});
