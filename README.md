# ziwei-master · 紫微斗数全能 CLI

**本命排盘 + 流月/流日/流时/流年推算** — 基于 [iztro](https://github.com/SylarLong/iztro) 开源库的一站式紫微斗数命令行工具。

## 功能

| 命令 | 功能 | 来源 |
|------|------|------|
| `chart` | 本命盘 12 宫星曜、四化、大限 | iztro 排盘引擎 |
| `yearly` | 流年推算（含四化、流耀） | iztro horoscope API |
| `monthly` | 流月推算（含四化、流宫映射） | iztro horoscope API |
| `daily` | 流日推算（含四化、流宫映射） | iztro horoscope API |
| `hourly` | 流时推算 | iztro horoscope API |
| `now` | 当前所有运限（大限+小限+流年+流月+流日+流时） | iztro horoscope API |
| `star` | 14 主星知识查询 | 内置知识库 |
| `palace` | 12 宫位信息查询 | 内置知识库 |
| `shichen` | 时辰对照表 | 内置数据 |

## 快速开始

```bash
# 克隆
git clone https://github.com/leung95/ziwei-master.git
cd ziwei-master

# 安装依赖（只需在仓库内运行一次）
npm install

# 安装并在系统中注册 "ziwei" 命令（macOS / Linux）
./scripts/install.sh

# 或在 Windows PowerShell 中运行：
.\scripts\install.ps1

# 安装完成后，你可以在任意终端直接使用：
# 本命排盘
ziwei chart 1990 1 1 12 male

# 流月推算 (2026年7月，可手动指定性别 male / female)
ziwei monthly 1990 1 1 12 female 2026 7

# 流日推算 (2026年7月15日)
ziwei daily 1990 1 1 12 2026 7 15

# 当前所有运限
ziwei now 1990 1 1 12

# 星曜知识
ziwei star 紫微
```

### 通过 Python

```bash
python py/ziwei.py chart 1990 1 1 12 male
python py/ziwei.py monthly 1990 1 1 12 female 2026 7
```

说明：新安装脚本会通过 npm link 将本仓库的命令注册到全局 PATH。运行 ziwei 时，程序会优先尝试使用系统中已安装的 tsx；若未发现，会回退使用 npx tsx 作为一次性执行的后备方式。

## 参数说明

### chart 命令
```
chart <年> <月> <日> <时> [male|female]
```
- 时：0-23（24小时制）
- 性别：可填 `male` / `female`（或 `男` / `女`），缺省按男性
- 输出：12宫星曜、亮度（庙旺/平/落陷）、四化、大限

### 流运命令
```
monthly <生年> <月> <日> <时> <目标年> <目标月> [male|female]
daily   <生年> <月> <日> <时> <目标年> <目标月> <目标日> [male|female]
yearly  <生年> <月> <日> <时> <目标年> [male|female]
now     <生年> <月> <日> <时> [male|female]
```
- 流运输出：四化（禄权科忌）、流限十二宫对照本命、流耀（动态星曜）
- 性别：可填 `male` / `female`（或 `男` / `女`），缺省按男性。性别影响大限/小限计算，推荐显式传入
- 参数校验：出生/流运的非法日期、非法时辰（非 0-23）会给出明确报错和用法提示

## 输出示例

```
════════════════════════════════════════════════════
  紫微斗数命盘
  出生：1990-1-1 午时  性别：男
  农历：一九八九年腊月初五
  干支：己巳 丙子 癸酉 戊午  五行局：木三局
  命宫：午  身宫：戌
────────────────────────────────────────────────────
  【十二宫星曜】
  命宫     [午]
    主星：太阳、太阴
    辅星：文昌、文曲、天魁
    大限：6-15岁
...
════════════════════════════════════════════════════
  流月推运
  本命：1990/1/1 午时
  流月：2026年7月
────────────────────────────────────────────────────
【流月】田宅宫（甲午）
  四化：禄：廉贞 | 权：破军 | 科：武曲 | 忌：太阳
  流限十二宫对照本命宫位：
    命宫     → 田宅
    兄弟宫    → 官禄
    ...
    田宅宫    → 命宫     ◀ 流限在此
```

## 技术栈

- **TypeScript** — 核心 CLI
- **[iztro](https://github.com/SylarLong/iztro)** v2.5.8 — 紫微斗数排盘 + 流运计算
- **tsx** — TypeScript 直接运行

## 许可

MIT License

## 致谢

- [SylarLong/iztro](https://github.com/SylarLong/iztro) — 提供核心排盘与流运计算引擎
- [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) — 倪海厦体系参考
