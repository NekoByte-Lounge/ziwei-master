import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalPalace } from 'iztro/lib/astro/FunctionalPalace';

export interface Pattern {
  name: string;
  desc: string;
  match: (al: IFunctionalAstrolabe) => boolean;
}

function starNames(p: IFunctionalPalace | undefined): string[] {
  if (!p) return [];
  return [...p.majorStars, ...p.minorStars].map(s => s.name);
}

function surroundedStarNames(al: IFunctionalAstrolabe): string[] {
  const ming = al.palaces.find(p => p.name === '命宫');
  const sp = al.surroundedPalaces(ming?.index ?? 0);
  return [
    ...starNames(sp.target),
    ...starNames(sp.wealth),
    ...starNames(sp.career),
    ...starNames(sp.opposite),
  ];
}

function hasAll(names: string[], wanted: string[]): boolean {
  return wanted.every(w => names.includes(w));
}

export const PATTERNS: Pattern[] = [
  {
    name: '杀破狼',
    desc: '命宫三方四正见七杀、破军、贪狼，主开创、变动、魄力强。',
    match: (al) => {
      const names = surroundedStarNames(al);
      return hasAll(names, ['七杀', '破军', '贪狼']);
    },
  },
  {
    name: '机月同梁',
    desc: '命宫三方四正见天机、太阴、天同、天梁中至少两颗，主稳健、谋略、幕后协调。',
    match: (al) => {
      const names = surroundedStarNames(al);
      const count = ['天机', '太阴', '天同', '天梁'].filter(n => names.includes(n)).length;
      return count >= 2;
    },
  },
  {
    name: '府相朝垣',
    desc: '命宫三方四正同时见天府、天相，主稳重、有管理能力、贵人相助。',
    match: (al) => {
      const names = surroundedStarNames(al);
      return hasAll(names, ['天府', '天相']);
    },
  },
  {
    name: '阳梁昌禄',
    desc: '命宫三方四正见太阳、天梁、文昌、禄存，主才华、功名、科甲之象。',
    match: (al) => {
      const names = surroundedStarNames(al);
      return hasAll(names, ['太阳', '天梁', '文昌', '禄存']);
    },
  },
  {
    name: '日月同宫',
    desc: '命宫三方四正同时见太阳、太阴，主阴阳调和、贵气与亲和并存。',
    match: (al) => {
      const names = surroundedStarNames(al);
      return hasAll(names, ['太阳', '太阴']);
    },
  },
];

export function matchedPatterns(al: IFunctionalAstrolabe): Pattern[] {
  return PATTERNS.filter(p => p.match(al));
}
