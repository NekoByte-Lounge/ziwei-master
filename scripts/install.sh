#!/usr/bin/env bash
# Install script for macOS / Linux
# 用法: ./scripts/install.sh
# 作用: 安装依赖(npm ci/install) 后通过 npm link 注册全局 ziwei 命令
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "错误：未找到 Node.js，请先安装 Node.js 与 npm（https://nodejs.org）。" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "错误：未找到 npm，请先安装 Node.js 与 npm（https://nodejs.org）。" >&2
  exit 1
fi

echo "Installing ziwei command to your system..."

cd "$REPO_ROOT"

if [ -f package-lock.json ]; then
  echo "npm ci ..."
  npm ci
else
  echo "npm install ..."
  npm install
fi

echo "Linking package (npm link) -- you may need to provide sudo depending on your setup"
npm link

echo ""
echo "Done. You can now run from any terminal:"
echo "  ziwei chart 1990 1 1 12 male"
echo "  ziwei monthly 1990 1 1 12 2026 7"
