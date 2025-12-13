# Install and Setup Script for Univer Sheets
# Run this script once after git clone

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Univer Sheets - First Time Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pgPassword = "Phuc3724@"

# Check prerequisites
Write-Host "`n[1/5] Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..." -ForegroundColor Gray
    npm install -g pnpm
}

# Check PostgreSQL
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if (-not $pgService) {
    Write-Host "ERROR: PostgreSQL is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "Prerequisites OK" -ForegroundColor Green

# Create database
Write-Host "`n[2/5] Creating database 'univer'..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPassword
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE univer;" 2>$null
Write-Host "Database ready" -ForegroundColor Green

# Install dependencies
Write-Host "`n[3/5] Installing dependencies..." -ForegroundColor Yellow

Write-Host "Installing USIP Server dependencies..."
Set-Location "$rootDir\usip-server"
pnpm install --silent

Write-Host "Installing Frontend dependencies..."
Set-Location "$rootDir\univer-start-kit"
pnpm install --silent

Write-Host "Dependencies installed" -ForegroundColor Green

# Create Docker network and initialize schema
Write-Host "`n[4/5] Initializing database schema..." -ForegroundColor Yellow
docker network create univer-prod 2>$null

Set-Location "$rootDir\all-in-one.amd64.0.12.4\univer-server-0.12.4"
docker run --rm --network univer-prod `
    -e HOST=host.docker.internal `
    -e PORT=5432 `
    -e USERNAME=postgres `
    -e "PASSWORD=$pgPassword" `
    -e DATABASE=univer `
    univer-acr-registry.cn-shenzhen.cr.aliyuncs.com/release/universer-sql:0.0.18

Write-Host "Schema initialized" -ForegroundColor Green

# Start Docker containers
Write-Host "`n[5/5] Starting Docker containers..." -ForegroundColor Yellow
docker-compose --env-file .env --env-file .env.custom up -d

Write-Host "Waiting for containers..."
Start-Sleep -Seconds 20

# Done
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "  To start the system, run: .\start.ps1" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $rootDir
