// 紫微斗数基础常量与内置知识库
export const PNAMES = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫',
];
export const SHORT = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
export const STEMS = '甲乙丙丁戊己庚辛壬癸'.split('');
export const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'.split('');

export interface StarKnowledge {
  kw: string;
  nat: string;
  el: string;
}

export const SD: Record<string, StarKnowledge> = {
  紫微: { kw: '帝王·尊贵·独立', nat: '中性偏吉', el: '土' },
  天机: { kw: '智慧·机变·谋略', nat: '吉星', el: '木' },
  太阳: { kw: '阳刚·官贵·慷慨', nat: '吉星', el: '火' },
  武曲: { kw: '财富·刚毅·果断', nat: '中性', el: '金' },
  天同: { kw: '温和·享福·随缘', nat: '吉星', el: '水' },
  廉贞: { kw: '才艺·刑囚·桃花', nat: '凶中带吉', el: '火' },
  天府: { kw: '财库·稳重·保守', nat: '吉星', el: '土' },
  太阴: { kw: '柔美·财富·阴柔', nat: '吉星', el: '水' },
  贪狼: { kw: '欲望·桃花·多才', nat: '中性', el: '木' },
  巨门: { kw: '口舌·是非·善辩', nat: '凶中带吉', el: '水' },
  天相: { kw: '辅佐·行政·印绶', nat: '吉星', el: '水' },
  天梁: { kw: '荫护·医药·长辈', nat: '吉星', el: '土' },
  七杀: { kw: '将星·果决·孤克', nat: '凶星', el: '金' },
  破军: { kw: '开创·变动·破坏', nat: '凶星', el: '水' },
};
