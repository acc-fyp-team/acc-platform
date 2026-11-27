# ACC Platform

A construction management system for contractors, built as a Final Year Project at the
University of Management and Technology (UMT), Lahore.

Contractors keep their records on paper — material deliveries in one register, labour
attendance in another, and the costs added up by hand at the end of the month. ACC Platform
puts all of that in one place, so the office and the site are looking at the same
information.

The system keeps records of clients, employees, materials and projects, controls who in the
company is allowed to see and change what, and shows the current position of each project.

---

## Team

| Member | Roll number | Works on |
|---|---|---|
| M. Hamid Idrees | F2023065008 | Team lead — backend, authentication, web portal |
| Faseeha Rashid | F2023065035 | Materials, attendance, salaries, reports |
| Rehan Ishaq | F2023065046 | Projects, billing, mobile application |

---

## Built with

ASP.NET Core Web API (.NET 10) · PostgreSQL with Entity Framework Core · React with Vite and
TypeScript · React Native with Expo

---

## What is working so far

- Sign in and sign out
- Roles and permissions — an administrator decides which modules each user can open, and what
  they can do inside them
- Clients — add, view, edit, delete, search and filter
- Employees — add, view, edit, delete, search and filter
- Dashboard showing current counts

More modules are added sprint by sprint.

---

## How to run it

You need the .NET 10 SDK, Node.js, and a PostgreSQL database.

**Backend**

```bash
cd Backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your database connection string>"
dotnet user-secrets set "Jwt:Key" "<any random text, at least 32 characters>"
dotnet user-secrets set "Seed:AdminUsername" "<admin username>"
dotnet user-secrets set "Seed:AdminPassword" "<admin password>"
dotnet ef database update
dotnet run
```

Runs at `http://localhost:5112`. The endpoints can be tried at `http://localhost:5112/scalar/v1`.

**Web portal**

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` and sign in.

**Mobile app** — see [`Mobile/README.md`](Mobile/README.md).

---

No passwords or keys are saved in this repository. They are kept in user secrets, as shown
above.
