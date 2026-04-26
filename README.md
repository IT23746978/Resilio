# Resilio — Disaster Relief Resource Management System

[![CI - Backend](https://github.com/IT23746978/Resilio/actions/workflows/pr-backend-main.yml/badge.svg)](https://github.com/IT23746978/Resilio/actions/workflows/pr-backend-main.yml)
[![CI - Frontend](https://github.com/IT23746978/Resilio/actions/workflows/pr-frontend-main.yml/badge.svg)](https://github.com/IT23746978/Resilio/actions/workflows/pr-frontend-main.yml)

A full-stack web application for managing disaster relief resources, volunteers, and relief requests.

It supports three user roles: **affected persons* and **Admin**, with a fully passwordless OTP-based authentication system.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + CSS Modules (Native Fetch API) |
| Backend | ASP.NET Core 8 Web API (C#) |
| Database | Azure SQL Database (SQL Server) |
| Auth | Passwordless OTP (Email via Gmail SMTP) + JWT Auth |
| Version Control | GitHub |
| CI/CD | GitHub Actions |
| Deployment | Azure App Service + Azure Static Web Apps |
| Testing | xUnit, Coverlet |
| Project Management | JIRA (Scrum) |

---

## Live URLs

| Environment | Service | URL |
|---|---|---|
| Production | Frontend | https://resilio-frontend-gpghg8ezfpgtdvds.eastasia-01.azurewebsites.net |
| Production | Backend API | https://resiliodrrcs-backend-hxc7gxbwbdcjbhdy.eastasia-01.azurewebsites.net |
| Production | Swagger UI | https://resiliodrrcs-backend-hxc7gxbwbdcjbhdy.eastasia-01.azurewebsites.net/swagger |
| Production | Health Check | https://resiliodrrcs-backend-hxc7gxbwbdcjbhdy.eastasia-01.azurewebsites.net/api/health |
| Staging | Backend API | https://resilio-backend-staging-a3edfwg9cjgzg2cd.eastasia-01.azurewebsites.net |
| Staging | Health Check | https://resilio-backend-staging-a3edfwg9cjgzg2cd.eastasia-01.azurewebsites.net/api/health |


---

## Folder Structure

```
Resilio/
├── .github/
│   └── workflows/
│       ├── ci-backend.yml        # ASP.NET build and test pipeline
│       ├── ci-frontend.yml       # React build pipeline
│       └── cd-azure.yml          # Azure deployment pipeline
├── backend/
│   ├── Resilio.API/              # ASP.NET Web API — controllers, middleware, JWT setup
│   ├── Resilio.Core/             # Models, DTOs, interfaces
│   ├── Resilio.Infrastructure/   # Repositories, data access
│   └── Resilio.Tests/            # xUnit unit tests
├── database/
│   ├── init.sql                  # Main DB schema definitions
│   └── resources.sql             # Resources allocation script
├── docs/
│   ├── api/                      # Swagger JSON and API documentation
│   ├── architecture/             # System and deployment diagrams
│   ├── coverage/                 # Coverlet code coverage reports
│   ├── deployment/               # Deployment and environment setup guides
│   ├── retrospectives/           # Sprint retrospective notes
│   └── standups/                 # Daily standup logs
└── frontend/
    ├── public/
    └── src/
        ├── api/                  # Native fetch API clients (httpClient.js)
        ├── auth/                 # Context API components (AuthContext.jsx)
        ├── components/           # Reusable React components
        └── pages/                # Admin, Victim, and Volunteer page screens
```

---

## Prerequisites

Make sure you have the following installed before setting up the project locally:

- [Git](https://git-scm.com/)
- [Node.js v20+](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- A running SQL Server instance (Local or Azure SQL)

---

## Local Development Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/IT23746978/Resilio.git
cd Resilio
```

### Step 2 — Configure the backend environment

Create `backend/Resilio.API/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:resilio-sqlserver.database.windows.net,1433;Initial Catalog=resilio-db;Persist Security Info=False;User ID=ResilioAdmin;Password=Resilio@csp#Admin;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  },
  "Auth": {
    "JwtKey": "your-secret-jwt-key-min-32-chars",
    "JwtIssuer": "Resilio",
    "JwtAudience": "ResilioClient"
  },
  "Otp": {
    "HmacSecret": "your-otp-hmac-secret"
  },
  "TokenHashing": {
    "HmacSecret": "your-token-hmac-secret"
  },
  "Gmail": {
    "SenderEmail": "your-gmail@gmail.com",
    "AppPassword": "your-app-password"
  }
}
```

> ⚠️ This file is in `.gitignore`. You must create it manually and fill in valid SQL credentials and secure HMAC/JWT keys.

### Step 3 — Database Initialization

Execute `database/init.sql` against your SQL Server using Azure Data Studio or SSMS to build the required tables (`Users`, `ReliefRequests`, `Volunteers`, `OtpRequests`, etc.).

### Step 4 — Run the applications

**Backend:**
```bash
cd backend/Resilio.API
dotnet restore
dotnet run
```
*Swagger UI is available at `http://localhost:[port]/swagger`*

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## Authentication Flow

The application relies on a **passwordless OTP** structure:
1. User requests login via email at `POST /api/auth/start`.
2. A 6-digit OTP is sent via Gmail SMTP.
3. User verifies code at `POST /api/auth/verify`.
4. API issues short-lived **JWT access tokens** and long-lived, encrypted **Refresh Tokens**.
*(Note: Sensitive data such as OTP codes and refresh tokens are HMAC-hashed internally before database storage).*

---

## Running Tests

### Unit tests
```bash
cd backend
dotnet test Resilio.sln --configuration Release --verbosity normal
```

### Code coverage
```bash
cd backend
dotnet test Resilio.sln --collect:"XPlat Code Coverage"
```

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only |
| `develop` | Integration branch — all features merge here first |
| `feature/[name]/[STORY-ID]-description` | New feature development |
| `fix/[name]/[STORY-ID]-description` | Bug fixes |
| `test/[name]/[STORY-ID]-description` | Pipeline or testing validation (never merged) |

### Branch protection rules
- PRs required before merging to `main` or `develop`.
- Both CI pipelines (`build-and-test` and `build`) must pass before merge.
- Force pushes are blocked on `main` and `develop`.

---

## CI/CD Pipeline

Every pull request to `main` or `develop` automatically triggers:

| Pipeline | What it does |
|---|---|
| CI - Backend | Restores NuGet packages, builds solution, runs xUnit tests |
| CI - Frontend | Installs npm packages, runs Vite build |

If either pipeline fails, the PR cannot be merged.

Continuous deployment to Azure App Service and Static Web Apps is configured on merges to `main` via `cd-azure.yml`.

---

## Environment Variables (Azure Production)

The following Environment Variables / App Settings must be configured in Azure for the backend to function:

| Name | Description |
|---|---|
| `ConnectionStrings__DefaultConnection` | Database connection string |
| `Auth__JwtKey` | Signing key for JWTs (min 32 chars) |
| `Auth__JwtIssuer` | JWT issuer string |
| `Auth__JwtAudience` | JWT audience string |
| `Otp__HmacSecret` | Server secret to encrypt OTP hashes |
| `TokenHashing__HmacSecret` | Server secret to encrypt Refresh Tokens |
| `Gmail__SenderEmail` | Auth email address |
| `Gmail__AppPassword` | App-specific password for SMTP relay |

---

## Documentation Index

| Document | Location |
|---|---|
| Deployment Guide | `/docs/deployment/README.md` |
| API Documentation | `/docs/api/` |
| Test Plan | `/docs/testing/` |
| Architecture Diagrams | `/docs/architecture/` |
| Sprint Retrospectives | `/docs/retrospectives/` |
| Daily Standup Logs | `/docs/standups/` |
