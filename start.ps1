# Start all services for Univer Sheets
# Run this script to start the system

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Univer Sheets System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Docker containers
Write-Host "`n[1/3] Starting Docker containers..." -ForegroundColor Yellow
Set-Location "$rootDir\all-in-one.amd64.0.12.4\univer-server-0.12.4"
docker-compose --env-file .env --env-file .env.custom up -d

Write-Host "Waiting for containers..."
Start-Sleep -Seconds 10

# Start USIP Server in background
Write-Host "`n[2/3] Starting USIP Server (port 3001)..." -ForegroundColor Yellow
Set-Location "$rootDir\usip-server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend in background
Write-Host "`n[3/3] Starting Frontend (port 5173)..." -ForegroundColor Yellow
Set-Location "$rootDir\univer-start-kit"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm dev" -WindowStyle Normal

Set-Location $rootDir

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  System Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nOpen browser: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nDemo Users:" -ForegroundColor White
Write-Host "  admin / admin123 (Owner)" -ForegroundColor Gray
Write-Host "  editor1 / editor123 (Editor)" -ForegroundColor Gray
Write-Host "  viewer1 / viewer123 (Reader)" -ForegroundColor Gray
Write-Host "`nTo stop: run .\stop.ps1" -ForegroundColor Yellow
