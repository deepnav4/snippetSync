# Snippet Sync Backend - Complete Setup Script
# Run this script to setup everything automatically

Write-Host "Starting Snippet Sync Backend Setup..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "npm is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies." -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow

# Generate Prisma Client
Write-Host "  Generating Prisma Client..." -ForegroundColor Cyan
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate Prisma Client." -ForegroundColor Red
    exit 1
}
Write-Host "Prisma Client generated!" -ForegroundColor Green

# Run migrations
Write-Host "  Running database migrations..." -ForegroundColor Cyan
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to run migrations." -ForegroundColor Red
    exit 1
}
Write-Host "Database setup complete!" -ForegroundColor Green

Write-Host ""
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Quick Start Guide:" -ForegroundColor Cyan
Write-Host "  1. Start development server: npm run dev" -ForegroundColor White
Write-Host "  2. Server will run at: http://localhost:5000" -ForegroundColor White
Write-Host "  3. Health check: http://localhost:5000/health" -ForegroundColor White
Write-Host "  4. Open Prisma Studio: npm run prisma:studio" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  - README.md - Main documentation" -ForegroundColor White
Write-Host "  - QUICKSTART.md - 5-minute setup guide" -ForegroundColor White
Write-Host "  - API_DOCS.md - Complete API reference" -ForegroundColor White
Write-Host "  - DATABASE_SCHEMA.md - Database design" -ForegroundColor White
Write-Host "  - VSCODE_INTEGRATION.md - VS Code extension guide" -ForegroundColor White
Write-Host ""
Write-Host "Ready to start? Run: npm run dev" -ForegroundColor Green
Write-Host ""
