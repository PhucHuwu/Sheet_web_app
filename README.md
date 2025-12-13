# Univer Sheets Web Application

A collaborative spreadsheet editor with user authentication and permissions.

## Prerequisites

-   Docker Desktop (running)
-   Node.js 18+ with pnpm
-   PostgreSQL 16 (running)

## Quick Start

### First-Time Setup (run once after git clone)

```powershell
.\install.ps1
```

This will:

-   Install npm dependencies
-   Create database 'univer' in PostgreSQL
-   Initialize database schema
-   Update configuration with your PostgreSQL password

### Start System

```powershell
.\start.ps1
```

Open browser: http://localhost:5173

### Stop System

```powershell
.\stop.ps1
```

## Demo Users

| Username | Password  | Role                |
| -------- | --------- | ------------------- |
| admin    | admin123  | Owner (full access) |
| editor1  | editor123 | Editor (edit only)  |
| viewer1  | viewer123 | Reader (view only)  |

## Architecture

-   Frontend: http://localhost:5173 (Vite + Univer SDK)
-   USIP Server: http://localhost:3001 (Node.js authentication)
-   Univer Server: http://localhost:8000 (Docker)
-   Database: PostgreSQL local (localhost:5432)
