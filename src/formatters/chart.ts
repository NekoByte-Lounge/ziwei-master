import { PNAMES } from '../knowledge.js';

// 将 iztro Astrolabe 格式化为可读文本
export function fmtChart(al: any): string[] {
  const L: string[] = [];
  const g = al.gender;
  L.push('═'.repeat(52));
  L.push('  紫微斗数命盘');
  L.push('  出生：' + al.solarDate + ' ' + al.time + '  性别：' + g);
  L.push('  农历：' + al.lunarDate);
  L.push('  干支：' + al.chineseDate + '  五行局：' + al.fiveElementsClass);
  L.push('  命宫：' + al.earthlyBranchOfSoulPalace + '  身宫：' + al.earthlyBranchOfBodyPalace);
  L.push('  生肖：' + al.zodiac + '  星座：' + al.sign);
  L.push('─'.repeat(52));
  L.push('  【十二宫星曜】');

  // Find ming palace index
  const mingP = al.palaces.findIndex((pp: any) => pp.name === '命宮');
  for (let i = 0; i < 12; i++) {
    const p = al.palace(i);
    if (!p) continue;
    const ms = p.majorStars ?? [];
    const os = [...(p.minorStars ?? []), ...(p.adjectiveStars ?? [])].filter(Boolean);

    let hdr = '  ' + (p.name || PNAMES[i]).padEnd(6) + ' [' + p.earthlyBranch + ']';
    if (p.isBodyPalace) hdr += ' 身宫';
    if (i === mingP && !p.isBodyPalace) hdr += ' 命宫';
    L.push(hdr);

    if (ms.length > 0) {
      const si = ms.map((s: any) => {
        let n = s.name;
        if (s.siHua) n += '[' + s.siHua + ']';
        if (s.brightness) n += '(' + (s.brightness === 'bright' ? '庙旺' : s.brightness === 'dim' ? '落陷' : '平') + ')';
        return n;
      });
      L.push('    主星：' + si.join('、'));
    } else {
      L.push('    主星：无');
    }
    if (os.length > 0) L.push('    辅星：' + os.map((s: any) => s.name).join('、'));
    if (p.decadal) L.push('    大限：' + p.decadal.range[0] + '-' + p.decadal.range[1] + '岁');
  }

  // Four transformations
  L.push('─'.repeat(52));
  L.push('  【四化】');
  const sm: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const p = al.palace(i);
    if (!p) continue;
    for (const s of [...(p.majorStars ?? []), ...(p.minorStars ?? [])]) {
      if (s.siHua) sm[s.name] = s.siHua;
    }
  }
  if (Object.keys(sm).length > 0) {
    L.push('  ' + Object.entries(sm).map(([n, sh]) => n + '化' + sh).join('、'));
  } else {
    L.push('  无四化');
  }
  L.push('═'.repeat(52));
  return L;
}
