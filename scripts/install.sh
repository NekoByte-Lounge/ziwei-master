#!/usr/bin/env bash
# Install script for macOS / Linux
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Installing ziwei command to your system (using npm link)..."

pushd "$REPO_ROOT" >/dev/null

if command -v npm >/dev/null 2>&1; then
  # Ensure tsx is available globally or will be used via npx fallback
  echo "Linking package (npm link) -- you may need to provide sudo depending on your setup"
  npm link
  echo "Done. You can now run 'ziwei' from any terminal."
else
  echo "npm not found. Please install Node.js and npm first." >&2
  exit 1
fi

popd >/dev/null

