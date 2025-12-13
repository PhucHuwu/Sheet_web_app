# Install and Setup Script for Univer Sheets
# Run this script once after git clone

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Univer Sheets - First Time Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$univerDir = "$rootDir\all-in-one.amd64.0.12.4"
$univerServerDir = "$univerDir\univer-server-0.12.4"
$pgPassword = "Phuc3724@"
$univerDownloadUrl = "https://release-univer.oss-cn-shenzhen.aliyuncs.com/release/all-in-one.amd64.0.12.4.tar.gz"

# Check prerequisites
Write-Host "`n[1/7] Checking prerequisites..." -ForegroundColor Yellow

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

# Download Univer Server if not exists
Write-Host "`n[2/7] Checking Univer Server package..." -ForegroundColor Yellow
if (-not (Test-Path $univerServerDir)) {
    Write-Host "Downloading Univer Server package..."
    $tarFile = "$rootDir\univer.tar.gz"
    
    # Download
    Invoke-WebRequest -Uri $univerDownloadUrl -OutFile $tarFile -UseBasicParsing
    
    # Extract
    Write-Host "Extracting..."
    tar -xzf $tarFile -C $rootDir
    
    # Clean up
    Remove-Item $tarFile
    
    Write-Host "Univer Server downloaded and extracted" -ForegroundColor Green
} else {
    Write-Host "Univer Server package exists" -ForegroundColor Green
}

# Apply custom patches
Write-Host "`n[3/7] Applying configuration patches..." -ForegroundColor Yellow
$patchDir = "$rootDir\univer-patches"
if (Test-Path $patchDir) {
    Copy-Item "$patchDir\config.yaml" -Destination "$univerServerDir\configs\config.yaml" -Force
    Copy-Item "$patchDir\.env.custom" -Destination "$univerServerDir\.env.custom" -Force
    Write-Host "Patches applied" -ForegroundColor Green
}

# Create database
Write-Host "`n[4/7] Creating database 'univer'..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPassword
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE univer;" 2>$null
Write-Host "Database ready" -ForegroundColor Green

# Install dependencies
Write-Host "`n[5/7] Installing dependencies..." -ForegroundColor Yellow

Write-Host "Installing USIP Server dependencies..."
Set-Location "$rootDir\usip-server"
pnpm install --silent

Write-Host "Installing Frontend dependencies..."
Set-Location "$rootDir\univer-start-kit"
pnpm install --silent

Write-Host "Dependencies installed" -ForegroundColor Green

# Create Docker network and initialize schema
Write-Host "`n[6/7] Initializing database schema..." -ForegroundColor Yellow
docker network create univer-prod 2>$null

Set-Location $univerServerDir
docker run --rm --network univer-prod `
    -e HOST=host.docker.internal `
    -e PORT=5432 `
    -e USERNAME=postgres `
    -e "PASSWORD=$pgPassword" `
    -e DATABASE=univer `
    univer-acr-registry.cn-shenzhen.cr.aliyuncs.com/release/universer-sql:0.0.18

Write-Host "Schema initialized" -ForegroundColor Green

# Start Docker containers
Write-Host "`n[7/7] Starting Docker containers..." -ForegroundColor Yellow
docker-compose --env-file .env --env-file .env.custom up -d

Write-Host "Waiting for containers..."
Start-Sleep -Seconds 20

# Done
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "  To start the system, run: .\start.ps1" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $rootDir
