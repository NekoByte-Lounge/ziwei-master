#!/usr/bin/env python3
r"""
ziwei-master — Python 包装器

说明：推荐在仓库根运行安装脚本注册全局命令 `ziwei`，然后直接使用 `ziwei`。
  ./scripts/install.sh        # macOS / Linux
  .\scripts\install.ps1      # Windows PowerShell

用法:
  python py/ziwei.py chart 1995 10 14 18 male
  python py/ziwei.py monthly 1995 10 14 18 2026 7
  python py/ziwei.py daily 1995 10 14 18 2026 7 15
  python py/ziwei.py now 1995 10 14 18
  python py/ziwei.py star 紫微
  python py/ziwei.py palace 命宫

或（若已安装）：
  ziwei chart 1995 10 14 18 male
"""
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Prefer to call global 'ziwei' if available, else fall back to npx tsx
CLI = ROOT / "cli" / "ziwei.ts"
NPX = None
ZIWEI_CMD = None
try:
    import shutil
    if shutil.which('ziwei'):
        ZIWEI_CMD = 'ziwei'
    else:
        NPX = shutil.which('npx') or None
except Exception:
    NPX = None

def run(args):
    if ZIWEI_CMD:
        cmd = [ZIWEI_CMD] + args
    elif NPX:
        cmd = [NPX, "tsx", str(CLI)] + args
    else:
        raise RuntimeError('无法找到 ziwei 或 npx。请先运行 ./scripts/install.sh 或安装 npx/tsx')
    r = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, timeout=60)
    if r.returncode:
        raise RuntimeError(r.stderr.strip() or r.stdout.strip())
    return r.stdout

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    try:
        print(run(sys.argv[1:]))
    except Exception as e:
        print(f"错误: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
