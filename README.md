# Money Manager

Expense & income tracking web app. Spring Boot REST API + React SPA + PostgreSQL.

## Architecture

```
PostgreSQL  →  Spring Boot API (Java 17)  →  React SPA (Vite)
```

- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security (JWT, stateless), Maven
- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Axios
- **Database**: PostgreSQL 16

## Features

- User registration/login with JWT auth, BCrypt password hashing
- Expense & income CRUD (add/edit/delete/view), scoped per user
- Dashboard: total income/expense/balance, monthly figures, top expense category, last 5 transactions
- User profile view

## Prerequisites

- **Local run**: Java 17+, Maven 3.9+, Node 20+, PostgreSQL 16 (running locally)
- **Docker run**: Docker + Docker Compose only

## Option A — Run with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Postgres: localhost:5432 (user/pass: `postgres`/`postgres`, db: `moneymanager`)

Stop with `docker compose down`. Add `-v` to also wipe the DB volume.

## Option B — Run locally without Docker

### 1. Database

Create a Postgres database:

```bash
createdb moneymanager
# or via psql:
psql -U postgres -c "CREATE DATABASE moneymanager;"
```

### 2. Backend

```bash
cd backend
# Optional: override defaults via env vars (defaults shown)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=moneymanager
export DB_USER=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=change-this-super-secret-key-min-256-bits-long-for-hs256

mvn spring-boot:run
```

API runs on `http://localhost:8080`. Tables are auto-created via `ddl-auto: update` on first run.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`. It talks to the API at `http://localhost:8080/api` by default (see `.env.example` — copy to `.env` to override via `VITE_API_BASE_URL`).

## Running Tests (backend)

```bash
cd backend
mvn test
```

Tests run against an in-memory H2 database (`test` profile) — no external Postgres needed for tests. Covers: auth (register/login/validation/duplicate email), expense CRUD + cross-user ownership isolation, dashboard aggregation logic.

## API Overview

All endpoints prefixed `/api`. Protected endpoints require `Authorization: Bearer <token>`.

| Method         | Endpoint                     | Description                                                      |
| -------------- | ---------------------------- | ---------------------------------------------------------------- |
| POST           | `/auth/register`           | Register new user                                                |
| POST           | `/auth/login`              | Login, returns JWT                                               |
| GET            | `/auth/profile`            | Current user profile (protected)                                 |
| GET/POST       | `/expenses`                | List / create expenses (protected)                               |
| GET/PUT/DELETE | `/expenses/{id}`           | Get / update / delete one expense (protected)                    |
| GET/POST       | `/incomes`                 | List / create incomes (protected)                                |
| GET/PUT/DELETE | `/incomes/{id}`            | Get / update / delete one income (protected)                     |
| GET            | `/dashboard?month=yyyy-MM` | Dashboard summary, month optional (defaults current) (protected) |

## Project Structure

```
Money-Manager/
├── backend/            # Spring Boot API
│   └── src/main/java/com/moneymanager/
│       ├── entity/     # JPA entities (User, Expense, Income, Category)
│       ├── repository/ # Spring Data JPA repos
│       ├── service/    # Business logic
│       ├── controller/ # REST endpoints
│       ├── security/   # JWT filter, util, UserDetailsService
│       ├── dto/        # Request/response records
│       └── exception/  # Global error handling
├── frontend/           # React SPA
│   └── src/
│       ├── pages/       # Login, Register, Dashboard, Expenses, Income, Profile
│       ├── components/  # Navbar, Modal, StatCard, ProtectedRoute
│       ├── context/     # AuthContext (JWT/session state)
│       └── api/         # Axios client + endpoint wrappers
└── docker-compose.yml
```

## End-to-End Tests

The frontend uses Playwright to test complete browser workflows across the React frontend, Spring Boot API, JWT authentication, and database.

Install the Playwright browser once:

```bash
cd frontend
npx playwright install chromium
```

Start the application before running the tests:

```bash
docker compose up --build
```

Run all E2E tests from the `frontend` directory:

```bash
npm run test:e2e
```

The test suite contains 6 tests covering:

- User registration and dashboard access
- Adding an expense
- Adding income
- Editing and deleting an expense
- Preventing future transaction dates
- Filtering dashboard totals and recent transactions by the selected month

The latest Playwright run passed all 6 tests.

## Notes

- Frontend build step: Vite compiles JSX/bundles on `npm run build` (or automatically inside the Docker image build).
