# Stop all services for Univer Sheets

Write-Host "Stopping Univer Sheets System..." -ForegroundColor Yellow

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Stop Docker containers
Write-Host "Stopping Docker containers..."
Set-Location "$rootDir\all-in-one.amd64.0.12.4\univer-server-0.12.4"
docker-compose --env-file .env --env-file .env.custom down

# Kill Node processes (USIP and Frontend)
Write-Host "Stopping Node.js processes..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Set-Location $rootDir

Write-Host "All services stopped." -ForegroundColor Green
