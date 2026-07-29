Param()
<#
PowerShell install script for Windows.
Run in an elevated or regular PowerShell as: .\scripts\install.ps1
#>
$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "Linking package using npm link..."
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Push-Location $repoRoot
    npm link
    Pop-Location
    Write-Host "Done. You can now run 'ziwei' from any terminal."
} else {
    Write-Error "npm not found. Please install Node.js and npm first."
    exit 1
}

