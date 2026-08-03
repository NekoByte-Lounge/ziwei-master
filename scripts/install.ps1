<#
PowerShell install script for Windows.
用法: powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1
作用: 安装依赖(npm ci/install) 后通过 npm link 注册全局 ziwei 命令
#>
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "未找到 Node.js，请先安装 Node.js 与 npm（https://nodejs.org）。"
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "未找到 npm，请先安装 Node.js 与 npm（https://nodejs.org）。"
    exit 1
}

Write-Host "Installing ziwei command to your system..."
Push-Location $repoRoot

if (Test-Path package-lock.json) {
    Write-Host "npm ci ..."
    npm ci
} else {
    Write-Host "npm install ..."
    npm install
}

Write-Host "Linking package (npm link) ..."
npm link

Pop-Location

Write-Host ""
Write-Host "Done. You can now run from any terminal:"
Write-Host "  ziwei chart 1990 1 1 12 male"
Write-Host "  ziwei monthly 1990 1 1 12 2026 7"
