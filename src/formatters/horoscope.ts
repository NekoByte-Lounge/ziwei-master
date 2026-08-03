import { PNAMES } from '../knowledge.js';

// 将 iztro Horoscope 的某个流限对象格式化为可读文本
export function fmtScope(item: any, label: string): string[] {
  const L: string[] = [];
  const idx = item.index ?? -1;
  const pn = idx >= 0 && idx < 12 ? PNAMES[idx] : '?';
  L.push('【' + label + '】' + pn + '（' + (item.heavenlyStem ?? '') + (item.earthlyBranch ?? '') + '）');
  if (item.mutagen?.length) {
    const m4 = ['禄', '权', '科', '忌'];
    L.push('  四化：' + item.mutagen.map((m: string, i: number) => m4[i] + '：' + m).join(' | '));
  }
  if (item.palaceNames?.length === 12) {
    L.push('  流限十二宫对照本命宫位：');
    for (let i = 0; i < 12; i++) {
      const f = i === idx ? ' ◀ 流限在此' : '';
      L.push('    ' + PNAMES[i].padEnd(6) + ' → ' + (item.palaceNames[i] ?? '').padEnd(6) + f);
    }
  }
  if (item.stars?.length) {
    const flat = item.stars.flat().filter(Boolean).map((s: any) => s.name).filter(Boolean);
    if (flat.length) L.push('  流耀：' + flat.join('、'));
  }
  return L;
}
