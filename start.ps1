# Worksheet Wizard - Environment Setup & Server Start
# Usage: .\start.ps1 [-Build] [-Port 5173]

param(
    [switch]$Build,
    [int]$Port = 5173
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Worksheet Wizard - Setup & Start" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# --- 1. Check Node.js ---
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $nodeVersion = (node --version).Trim()
    $major = [int]($nodeVersion -replace '^v(\d+)\..*', '$1')
    Write-Host "  Found Node.js $nodeVersion" -ForegroundColor Green
    if ($major -lt 18) {
        Write-Host "  Node.js 18+ is required. Current: $nodeVersion" -ForegroundColor Red
        Write-Host "  Installing via winget..." -ForegroundColor Yellow
        winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        Write-Host "  Node.js updated to $(node --version)" -ForegroundColor Green
    }
} else {
    Write-Host "  Node.js not found. Installing via winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "  Failed to install Node.js. Please install manually from https://nodejs.org" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Installed Node.js $(node --version)" -ForegroundColor Green
}

# --- 2. Check npm ---
Write-Host "`n[2/5] Checking npm..." -ForegroundColor Yellow
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) {
    Write-Host "  Found npm $(npm --version)" -ForegroundColor Green
} else {
    Write-Host "  npm not found. It should come with Node.js. Please reinstall Node.js." -ForegroundColor Red
    exit 1
}

# --- 3. Install dependencies ---
Write-Host "`n[3/5] Installing dependencies..." -ForegroundColor Yellow
Set-Location $ProjectRoot
if (-not (Test-Path "package.json")) {
    Write-Host "  package.json not found in $ProjectRoot" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "  Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  npm install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Dependencies installed." -ForegroundColor Green
} else {
    # Check if node_modules is up to date with package-lock.json
    $lockTime = (Get-Item "package-lock.json" -ErrorAction SilentlyContinue).LastWriteTime
    $modulesTime = (Get-Item "node_modules" -ErrorAction SilentlyContinue).LastWriteTime
    if ($lockTime -gt $modulesTime) {
        Write-Host "  package-lock.json changed. Running npm install..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  npm install failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "  Dependencies updated." -ForegroundColor Green
    } else {
        Write-Host "  Dependencies up to date." -ForegroundColor Green
    }
}

# --- 4. Build (optional) ---
if ($Build) {
    Write-Host "`n[4/5] Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Build complete." -ForegroundColor Green
} else {
    Write-Host "`n[4/5] Skipping build (use -Build flag to enable)" -ForegroundColor DarkGray
}

# --- 5. Start dev server ---
Write-Host "`n[5/5] Starting dev server on port $Port..." -ForegroundColor Yellow

# Kill any existing Vite process on the target port
$existing = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($existing) {
    foreach ($pid in $existing) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -eq "node") {
            Write-Host "  Stopping existing node process (PID: $pid) on port $Port..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force
        }
    }
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Server starting at http://localhost:$Port" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$env:PORT = $Port
npx vite --port $Port
