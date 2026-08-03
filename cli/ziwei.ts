#!/usr/bin/env npx tsx
/**
 * ziwei-master — 紫微斗数全能 CLI
 * 入口文件：核心逻辑已拆分到 src/ 目录。
 *
 * 用法:
 *   ziwei chart 1995 10 14 18 male
 *   ziwei monthly 1995 10 14 18 female 2026 7
 *   ziwei daily 1995 10 14 18 2026 7 15
 *   ziwei now 1995 10 14 18
 */
import { main } from '../src/cli.js';

main(process.argv.slice(2)).catch(e => { console.error('错误:', e); process.exit(1); });
