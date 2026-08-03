@echo off
REM Windows 安装入口：调用 PowerShell 脚本
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
