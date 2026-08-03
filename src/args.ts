// 命令行参数解析、校验与通用小工具
export type Gender = '男' | '女';

export const USAGE: Record<string, string> = {
  chart: 'ziwei chart <年> <月> <日> <时> [male|female] [--detailed]',
  now: 'ziwei now <生年> <月> <日> <时> [male|female]',
  yearly: 'ziwei yearly <生年> <月> <日> <时> <目标年> [male|female]',
  monthly: 'ziwei monthly <生年> <月> <日> <时> <目标年> <目标月> [male|female]',
  daily: 'ziwei daily <生年> <月> <日> <时> <目标年> <目标月> <目标日> [male|female]',
  hourly: 'ziwei hourly <生年> <月> <日> <时> <目标年> <目标月> <目标日> <目标时> [male|female]',
};
export const DEFAULT_USAGE = 'ziwei <命令> <年> <月> <日> <时> [参数...]';

export function genderFromToken(v: string): Gender | undefined {
  const t = v.trim().toLowerCase();
  if (t === 'male' || t === 'm' || t === '男') return '男';
  if (t === 'female' || t === 'f' || t === '女') return '女';
  return undefined;
}

export function fail(msg: string, usage?: string): never {
  console.error('错误：' + msg);
  if (usage) console.error('用法：' + usage);
  process.exit(1);
}

export function toInt(v: string | undefined): number | undefined {
  if (v === undefined || v.trim() === '') return undefined;
  const n = Number(v);
  return Number.isInteger(n) ? n : undefined;
}

export function isValidHour(h: number): boolean {
  return Number.isInteger(h) && h >= 0 && h <= 23;
}

export function isValidPlainDate(y: number, m: number, d: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  if (y <= 0 || m < 1 || m > 12 || d < 1) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function extractGender(args: string[]): { gender: Gender; rest: string[] } {
  let gender: Gender | undefined;
  const rest: string[] = [];
  for (const arg of args) {
    const g = genderFromToken(arg);
    if (g) {
      if (gender) fail('重复指定性别：' + arg, DEFAULT_USAGE);
      gender = g;
    } else {
      rest.push(arg);
    }
  }
  return { gender: gender ?? '男', rest };
}

export interface Flags {
  json: boolean;
  detailed: boolean;
  rest: string[];
}

export function extractFlags(args: string[]): Flags {
  const json = args.includes('--json');
  const detailed = args.includes('--detailed');
  const rest = args.filter(x => !x.startsWith('--'));
  return { json, detailed, rest };
}

export function expectNum(rest: string[], idx: number, name: string, usage: string): number {
  const v = toInt(rest[idx]);
  if (v === undefined) fail('缺少或无效的' + name + '参数：' + (rest[idx] ?? ''), usage);
  return v;
}

export function h2s(h: number): number {
  if (h >= 23 || h < 1) return 0;
  if (h < 3) return 1;
  if (h < 5) return 2;
  if (h < 7) return 3;
  if (h < 9) return 4;
  if (h < 11) return 5;
  if (h < 13) return 6;
  if (h < 15) return 7;
  if (h < 17) return 8;
  if (h < 19) return 9;
  if (h < 21) return 10;
  return 11;
}

export function p2(n: number): string {
  return String(n).padStart(2, '0');
}
