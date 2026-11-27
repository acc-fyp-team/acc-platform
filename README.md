# ACC Platform

**AI-Powered Construction ERP with Verifiable Material & Labour Tracking and Predictive Cost Analytics**

Final Year Project — BS Computer Science, University of Management and Technology (UMT), Lahore.

ACC Platform is a construction management system for small and mid-sized contractors in
Pakistan. It replaces the paper registers and WhatsApp messages most sites still run on with
a single record that the office and the site share. Material deliveries and daily labour
attendance are captured at the site and confirmed by a second person before they count, so
the cost figures the office sees can be traced back to who recorded them. On top of that
record, the platform forecasts where a project is heading financially instead of only
reporting where it has been.

---

## Team

| Member | Roll number | Role |
|---|---|---|
| M. Hamid Idrees | F2023065008 | Team Lead — backend, authentication, web portal, design system |
| Faseeha Rashid | F2023065035 | Core modules — clients, employees, materials, attendance |
| Rehan Ishaq | F2023065046 | Core modules — projects, billing, mobile application |

---

## Problem statement

Contractors on small and mid-sized projects track material and labour on paper. The office
learns what a site spent days or weeks later, by which point the money is already gone.
Two problems follow from this:

1. **Nothing is verifiable.** A delivery note or an attendance register is a single person's
   word. There is no second confirmation, so disputes over quantities and wages cannot be
   settled from the records.
2. **Nothing is predictive.** By the time a cost overrun shows up in a report, the decisions
   that caused it have already been made.

ACC Platform addresses both: every material and labour entry carries a verification trail,
and the cost data feeds a forecasting service that flags overruns while a project is still
running.

---

## Key features

- **Role-based access control** — eleven modules with five actions each, assigned per user
- **Verification chain** — material and labour entries require independent confirmation
  before they affect project costs
- **Client portal** — clients see progress and billing for their own projects only
- **Predictive cost analytics** — a Python service that forecasts project cost from the
  recorded history
- **Mobile field app** — offline-capable capture of deliveries and attendance from the site
- **Voice and WhatsApp input** — for site staff who do not use a dashboard

---

## Technology stack

| Layer | Technology |
|---|---|
| Backend API | ASP.NET Core Web API (.NET 10), N-tier (Controller → Service → Repository) |
| Database | PostgreSQL, hosted on Neon |
| ORM | Entity Framework Core 10 with Npgsql |
| Authentication | JWT bearer tokens, BCrypt password hashing |
| API documentation | OpenAPI with Scalar |
| Web portal | React 19, Vite, TypeScript, Tailwind CSS v4 |
| Mobile app | React Native with Expo, TypeScript |
| AI service | Python (planned — Phase 3) |

---

## Repository structure

```
acc-platform/
├── Backend/            ASP.NET Core Web API
│   ├── Auth/           JWT token service, permission attributes
│   ├── Controllers/    HTTP endpoints
│   ├── Data/           EF Core context, migrations, seeding
│   ├── Models/         Entities and DTOs
│   ├── Repositories/   Data access
│   └── Services/       Business logic
├── Frontend/           React web portal (admin and office users)
│   └── src/
│       ├── auth/       Authentication context
│       ├── components/ Shared UI — layout, modal, route guard
│       ├── lib/        API client
│       └── pages/      Screens
├── Mobile/             React Native (Expo) field application
└── ACC-Platform.slnx   Visual Studio solution
```

---

## Getting started

### Prerequisites

- .NET SDK 10.0 or later
- Node.js 20 or later
- A PostgreSQL database (the team uses Neon)

### Backend

```bash
cd Backend
dotnet restore
```

Configuration is held in user secrets, never in the repository:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your PostgreSQL connection string>"
dotnet user-secrets set "Jwt:Key" "<a random string of at least 32 characters>"
dotnet user-secrets set "Seed:AdminUsername" "<first admin username>"
dotnet user-secrets set "Seed:AdminPassword" "<first admin password>"
```

Apply the migrations and run:

```bash
dotnet ef database update
dotnet run
```

The API listens on `http://localhost:5112`. Interactive API documentation is at
`http://localhost:5112/scalar/v1` when running in Development.

On first run, if the `Users` table is empty, an administrator account is created from the
seed values above.

### Web portal

```bash
cd Frontend
npm install
npm run dev
```

The portal runs on `http://localhost:5173`. The backend's CORS policy allows this origin
only, so if Vite reports a different port, stop whatever is holding 5173 and start again.

### Mobile application

See [`Mobile/README.md`](Mobile/README.md).

---

## Configuration and secrets

No connection string, signing key or password is committed to this repository. Local
development uses `dotnet user-secrets`; deployments use environment variables. `appsettings`
files contain structure only, with empty values.

---

## Development workflow

Work happens on feature branches. `main` is protected: it cannot be pushed to directly, and
a pull request needs an approval from another team member before it can be merged.

```bash
git checkout main
git pull origin main
git checkout -b feature/<short-description>

# make the change, then
git add .
git commit -m "<what the commit does>"
git push origin feature/<short-description>
```

Open a pull request on GitHub, have another member review it, then merge and delete the
branch. Everyone pulls `main` afterwards.

Issues and sprint planning are tracked in Jira.

---

## Project status

Phase 1 (core platform) is in progress. Authentication, role-based permissions, the clients
and employees modules, the web portal shell and the mobile application scaffold are complete.

| Phase | Scope | Status |
|---|---|---|
| 1 | Core ERP — auth, permissions, clients, employees, materials, attendance | In progress |
| 2 | Verification chain and client portal | Planned |
| 3 | Predictive cost analytics (Python service) | Planned |
| 4 | Voice input, WhatsApp integration, offline sync | Planned |

---