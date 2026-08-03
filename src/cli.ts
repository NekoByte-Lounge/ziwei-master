import { astro } from 'iztro';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalPalace } from 'iztro/lib/astro/FunctionalPalace';
import { MUTAGEN_INFO, PALACE_INFO, PNAMES, SHORT, BRANCHES, SD } from './knowledge.js';
import {
  DEFAULT_USAGE, USAGE, expectNum, extractFlags, extractGender, fail,
  h2s, isValidHour, isValidPlainDate, p2, toInt,
} from './args.js';
import { fmtChart } from './formatters/chart.js';
import { fmtScope } from './formatters/horoscope.js';
import { matchedPatterns } from './patterns.js';

// ── Help ──
export function showHelp(): void {
  console.log([
    '',
    ' ╔══════════════════════════════════════╗',
    ' ║   ziwei-master · 紫微斗数全能 CLI   ║',
    ' ╚══════════════════════════════════════╝',
    '',
    ' 【本命排盘】',
    '   ziwei chart <年> <月> <日> <时> [male|female]',
    '   例: ziwei chart 1995 10 14 18 male',
    '',
    ' 【流运推算】（基于 iztro horoscope API）',
    '   ziwei now     <生年> <月> <日> <时> [male|female]',
    '   ziwei yearly  <生年> <月> <日> <时> <目标年> [male|female]',
    '   ziwei monthly <生年> <月> <日> <时> <目标年> <月> [male|female]',
    '   ziwei daily   <生年> <月> <日> <时> <目标年> <月> <日> [male|female]',
    '   ziwei hourly  <生年> <月> <日> <时> <目标年> <月> <日> <目标时> [male|female]',
    '   例: ziwei monthly 1995 10 14 18 female 2026 7',
    '',
    ' 【通用选项】',
    '   --json  输出 JSON（支持 chart/now/yearly/monthly/daily/hourly）',
    ' 【知识查询】',
    '   ziwei star    <星名>',
    '   ziwei palace  <宫名>',
    '   ziwei shichen',
    '',
    ' 【Python 包装】',
    '   python py/ziwei.py <命令> [参数...]',
    '   或（若已运行安装脚本）直接使用 ziwei <命令>',
    '',
  ].join('\n'));
}

// ── Main ──
export async function main(argv: string[]): Promise<void> {
  const a = argv;
  if (!a.length || a[0] === 'help') { showHelp(); return; }
  const cmd = a[0];

  // Star knowledge
  if (cmd === 'star') {
    const n = a[1];
    const d = SD[n];
    if (!d) { console.error('未知星曜。可用：' + Object.keys(SD).join('、')); process.exit(1); }
    console.log(n + '\n特性：' + d.kw + '\n吉凶：' + d.nat + '\n五行：' + d.el);
    return;
  }

  // Palace info
  if (cmd === 'palace') {
    const n = a[1];
    const idx = PNAMES.indexOf(n);
    if (idx < 0) { console.error('未知宫位。可用：' + PNAMES.join('、')); process.exit(1); }
    console.log(n + '（' + BRANCHES[(idx + 2) % 12] + '宫）');
    console.log('对宫：' + PNAMES[(idx + 6) % 12] + '（' + BRANCHES[(idx + 8) % 12] + '宫）');
    return;
  }

  // Shichen table
  if (cmd === 'shichen') {
    console.log('时辰对照表（24小时制 → 时辰索引）：');
    SHORT.forEach((s, i) => console.log('  ' + i + ' ' + s));
    return;
  }

  // Commands requiring birth info
  const { gender, rest: noFlags } = extractGender(a.slice(1));
  const { json, detailed, rest } = extractFlags(noFlags);
  const by = toInt(rest[0]);
  const bm = toInt(rest[1]);
  const bd = toInt(rest[2]);
  const bh = toInt(rest[3]);

  const usage = USAGE[cmd] ?? DEFAULT_USAGE;
  if (by === undefined || bm === undefined || bd === undefined || bh === undefined) {
    fail('需要提供出生年、月、日、时', usage);
  }
  if (!isValidPlainDate(by, bm, bd)) {
    fail('出生日期无效：' + by + '-' + p2(bm) + '-' + p2(bd), usage);
  }
  if (!isValidHour(bh)) {
    fail('出生时无效：' + bh + '（应为 0-23）', usage);
  }

  const sc = h2s(bh);
  const bds = by + '-' + p2(bm) + '-' + p2(bd);

  // Chart
  if (cmd === 'chart') {
    const extra = rest.slice(4);
    if (extra.length > 0) {
      fail('无效性别或多余参数：“' + extra.join(' ') + '”（可用 male / female 或 男 / 女）', usage);
    }
    const al: IFunctionalAstrolabe = astro.bySolar(bds, sc, gender, true, 'zh-CN');
    if (json) {
      console.log(JSON.stringify(al, null, 2));
      return;
    }
    console.log(fmtChart(al).join('\n'));

    // 详细分析：三方四正 / 格局 / 知识库
    const mingPalace = al.palaces.find((p: IFunctionalPalace) => p.name === '命宫');
    if (mingPalace && detailed) {
      console.log('═'.repeat(52));
      console.log('  【详细分析】');
      console.log('─'.repeat(52));

      // 命宫三方四正
      console.log('  【命宫三方四正】');
      const sp = al.surroundedPalaces(mingPalace.index);
      const four: Array<[string, IFunctionalPalace]> = [
        ['本宫', sp.target],
        ['财帛', sp.wealth],
        ['官禄', sp.career],
        ['对宫', sp.opposite],
      ];
      for (const [label, p] of four) {
        const majors = p.majorStars.map((s) => s.name).join('、') || '无';
        console.log('    ' + label.padEnd(4) + p.name + ' [' + p.earthlyBranch + '] 主星：' + majors);
      }
      console.log('─'.repeat(52));

      // 格局识别
      console.log('  【格局】');
      const hits = matchedPatterns(al);
      if (hits.length > 0) {
        for (const g of hits) console.log('    ' + g.name + '：' + g.desc);
      } else {
        console.log('    未命中内置格局');
      }
      console.log('─'.repeat(52));

      // 命宫百科
      console.log('  【命宫】');
      console.log('    ' + (PALACE_INFO[mingPalace.name] ?? ''));

      // 四化说明
      const sm: Record<string, string> = {};
      for (const p of al.palaces) {
        for (const s of [...p.majorStars, ...p.minorStars]) {
          if (s.mutagen) sm[s.name] = s.mutagen;
        }
      }
      if (Object.keys(sm).length > 0) {
        console.log('  【四化说明】');
        for (const [star, hua] of Object.entries(sm)) {
          console.log('    ' + star + '化' + hua + '：' + (MUTAGEN_INFO[hua] ?? ''));
        }
      }

      // 命宫主星知识
      console.log('  【命宫主星知识】');
      for (const s of mingPalace.majorStars) {
        const d = SD[s.name];
        if (d) console.log('  ' + s.name + '：' + d.kw + '（' + d.nat + '，五行' + d.el + '）');
      }
      console.log('═'.repeat(52));
    }
    return;
  }

  // Horoscope commands
  const al: IFunctionalAstrolabe = astro.bySolar(bds, sc, gender, true, 'zh-CN');

  if (cmd === 'now') {
    if (rest.length !== 4) {
      fail('now 参数应为 <生年> <月> <日> <时> [male|female]', usage);
    }
    const h = al.horoscope();
    if (json) {
      console.log(JSON.stringify({ command: 'now', birth: { year: by, month: bm, day: bd, hour: bh, timeIndex: sc, gender }, horoscope: h }, null, 2));
      return;
    }
    const L: string[] = ['═'.repeat(52)];
    L.push('  紫微斗数流运推算');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  当前：' + h.solarDate + '（' + h.lunarDate + '）');
    L.push('─'.repeat(52));
    if (h.decadal) L.push(...fmtScope(h.decadal, '大限'));
    if (h.age) L.push(...fmtScope(h.age, '小限(' + (h.age.nominalAge ?? '?') + '岁)'));
    if (h.yearly) L.push(...fmtScope(h.yearly, '流年'));
    if (h.monthly) L.push(...fmtScope(h.monthly, '流月'));
    if (h.daily) L.push(...fmtScope(h.daily, '流日'));
    if (h.hourly) L.push(...fmtScope(h.hourly, '流时'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'yearly') {
    if (rest.length !== 5) {
      fail('yearly 需要目标年', usage);
    }
    const ty = expectNum(rest, 4, '目标年', usage);
    const h = al.horoscope(ty + '-01-01');
    if (json) {
      console.log(JSON.stringify({ command: 'yearly', targetYear: ty, birth: { year: by, month: bm, day: bd, hour: bh, timeIndex: sc, gender }, horoscope: h }, null, 2));
      return;
    }
    const L: string[] = ['═'.repeat(52)];
    L.push('  流年推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流年：' + ty + '年');
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.yearly, '流年'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'monthly') {
    if (rest.length !== 6) {
      fail('monthly 需要目标年和目标月', usage);
    }
    const ty = expectNum(rest, 4, '目标年', usage);
    const tm = expectNum(rest, 5, '目标月', usage);
    if (tm < 1 || tm > 12) fail('目标月无效：' + tm + '（应为 1-12）', usage);
    const h = al.horoscope(ty + '-' + p2(tm) + '-01');
    if (json) {
      console.log(JSON.stringify({ command: 'monthly', targetYear: ty, targetMonth: tm, birth: { year: by, month: bm, day: bd, hour: bh, timeIndex: sc, gender }, horoscope: h }, null, 2));
      return;
    }
    const L: string[] = ['═'.repeat(52)];
    L.push('  流月推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流月：' + ty + '年' + tm + '月');
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.monthly, '流月'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'daily') {
    if (rest.length !== 7) {
      fail('daily 需要目标年、目标月、目标日', usage);
    }
    const ty = expectNum(rest, 4, '目标年', usage);
    const tm = expectNum(rest, 5, '目标月', usage);
    const td = expectNum(rest, 6, '目标日', usage);
    const ts = ty + '-' + p2(tm) + '-' + p2(td);
    if (tm < 1 || tm > 12) fail('目标月无效：' + tm + '（应为 1-12）', usage);
    if (!isValidPlainDate(ty, tm, td)) fail('目标日期无效：' + ts, usage);
    const h = al.horoscope(ts);
    if (json) {
      console.log(JSON.stringify({ command: 'daily', targetDate: ts, birth: { year: by, month: bm, day: bd, hour: bh, timeIndex: sc, gender }, horoscope: h }, null, 2));
      return;
    }
    const L: string[] = ['═'.repeat(52)];
    L.push('  流日推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流日：' + ts + '（' + h.lunarDate + '）');
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.daily, '流日'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'hourly') {
    if (rest.length !== 8) {
      fail('hourly 需要目标年、目标月、目标日、目标时', usage);
    }
    const ty = expectNum(rest, 4, '目标年', usage);
    const tm = expectNum(rest, 5, '目标月', usage);
    const td = expectNum(rest, 6, '目标日', usage);
    const th = expectNum(rest, 7, '目标时', usage);
    const ts = ty + '-' + p2(tm) + '-' + p2(td);
    if (tm < 1 || tm > 12) fail('目标月无效：' + tm + '（应为 1-12）', usage);
    if (!isValidPlainDate(ty, tm, td)) fail('目标日期无效：' + ts, usage);
    if (!isValidHour(th)) fail('目标时无效：' + th + '（应为 0-23）', usage);
    const tsc = h2s(th);
    const h = al.horoscope(ts, tsc);
    if (json) {
      console.log(JSON.stringify({ command: 'hourly', targetDate: ts, targetTimeIndex: tsc, birth: { year: by, month: bm, day: bd, hour: bh, timeIndex: sc, gender }, horoscope: h }, null, 2));
      return;
    }
    const L: string[] = ['═'.repeat(52)];
    L.push('  流时推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流时：' + ts + ' ' + SHORT[tsc]);
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.hourly, '流时'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  console.error('未知命令：' + cmd + '。可用：chart, now, yearly, monthly, daily, hourly, star, palace, shichen');
  process.exit(1);
}
