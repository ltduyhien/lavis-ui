LARVIS Station Terminal

> LARVIS: Hell-O hoo-man! Zank yOu for fixing me!

A React frontend for the LARVIS station API — a space-terminal UI for viewing satellite ore acquisitions, crew directory, and generating reports for Space Command. Built with TypeScript, Vite, shadcn/ui, and Tailwind CSS.

---

Table of Contents

1. Quick Start
2. Development
3. Production Deployment
4. Testing
5. CI/CD Pipeline
6. Project Structure
7. Application Features
8. Backend Improvement Suggestions
9. Frontend Enhancements (Future)

---

1. Quick Start

Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for production / full stack)
- Playwright browsers for E2E tests: npx playwright install

Clone and checkout

```bash
git clone <repo-url>
cd lavis-ui
git checkout main
```

Run the full stack (backend + frontend)

```bash
docker compose up
```

Frontend: http://localhost:5180
Backend API: http://localhost:8080

Default credentials: alice / bob / charlie — password 1234.

---

2. Development

Frontend only (API proxied to backend)

If the backend is running separately (e.g. via docker compose up backend):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies /api to the backend.

API base URL: Set VITE_API_URL in .env (e.g. http://localhost:8080) if the backend is not on the same origin.

---

3. Production Deployment

Docker Compose

```bash
docker compose up --build
```

- Frontend: Served by nginx on port 5180
- Backend: Runs on port 8080
- Frontend nginx proxies /api/ to http://backend:8080/

Manual build (frontend)

```bash
cd frontend
npm ci
npm run build
```

Output: frontend/dist. Serve with any static file server (e.g. nginx) and configure the API base URL if needed.

Environment variables

- VITE_API_URL — API base URL (dev / preview), default /api
- In production (Docker), /api is resolved by nginx and proxied to the backend.

---

4. Testing

Unit tests (Jest)

```bash
cd frontend
npm test
```

- npm test — Run unit tests
- npm run test:watch — Watch mode
- npm run test:coverage — Coverage report

E2E tests (Playwright)

E2E tests mock the LARVIS API; no backend required.

```bash
cd frontend
npx playwright install   # First time: install browsers
npm run test:e2e
```

- npm run test:e2e — All browsers (Chromium, Firefox, WebKit, Mobile)
- npm run test:e2e:chromium — Chromium only (faster)
- npm run test:e2e:ui — Interactive UI mode
- npm run test:e2e:visual — Visual regression tests only
- npm run test:e2e:update-snapshots — Update visual snapshots

Port: PLAYWRIGHT_PORT (default 5180). Playwright starts the dev server automatically.

Coverage: Auth (login, logout, validation), form validation, navigation, API mocking, visual regression, mobile (Pixel 5).

---

5. CI/CD Pipeline

GitHub Actions workflow: .github/workflows/ci.yml

Triggers: Push and pull requests to main

Steps

- Lint — npm run lint (ESLint)
- Unit — npm test (Jest unit tests)
- Build — npm run build (TypeScript + Vite)
- E2E — npm run test:e2e:chromium (Playwright Chromium)

All run in frontend/ on Node 20. E2E uses Playwright's built-in dev server and mocked API.

---

6. Project Structure

```text
larvis/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── Dockerfile
│   └── larvis
├── frontend/
│   ├── e2e/
│   │   ├── api-mock.ts
│   │   ├── auth-helper.ts
│   │   ├── auth.spec.ts
│   │   ├── forms.spec.ts
│   │   ├── mobile.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── visual.spec.ts
│   ├── public/
│   │   └── theme-init.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout/
│   │   │   ├── providers/
│   │   │   └── router/
│   │   ├── features/
│   │   │   ├── acquisitions/
│   │   │   ├── auth/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   ├── pages/
│   │   └── shared/
│   │       ├── api/
│   │       ├── ui/
│   │       ├── hooks/
│   │       ├── utils/
│   │       └── types/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── playwright.config.ts
│   ├── jest.config.cjs
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── frontend-assignment.md
└── README.md
```

Folder structure notes

1. app/ — Layout, auth context, theme, routing; runs once at app startup.
2. pages/ — Compositions that arrange features into screens.
3. features/ — Business logic and UI per domain (auth, acquisitions, reports, users, settings). Follows simplified Feature-Sliced Design; features only import from shared.
4. shared/ — Reusable UI, API client, utils, types; no business logic.
5. e2e/ — Playwright specs and helpers; API is mocked.

---

7. Application Features

Login

- Username + password form
- LARVIS greeting: "Hell-O hoo-man!"
- Redirect to dashboard on success
- Error message on invalid credentials
- Token stored in memory (no localStorage, XSS-safe)

Dashboard (Activities)

- Summary cards: Total scans, average ore sites, peak detection, trend (increasing/decreasing), sparklines
- Ore sites over time: Line/area chart with hover tooltips, brush/zoom for date range
- Histogram: Distribution of ore site counts
- Daily aggregation bar chart: Per-day totals or averages
- Date range filter: Shared across charts and table

Settings

- Humor slider (LARVIS personality setting)
- Password validation and change flow

UX

- Responsive: Sidebar on desktop, hamburger/bottom nav on mobile
- Dark theme: Space-terminal look
- Skeleton loaders while data loads
- CSP meta tag for XSS mitigation
- Sanitized chart rendering (no dangerouslySetInnerHTML)

Tech stack

- Framework — React 19 + TypeScript
- Build — Vite 7
- UI — shadcn/ui, Tailwind CSS
- Charts — Recharts
- Routing — React Router 7
- Tests — Jest (unit), Playwright (E2E)

---

8. Backend Improvement Suggestions

The LARVIS API is provided as a pre-compiled binary. The following improvements would make it more production-ready and secure:

Security

- Password storage: Plaintext passwords returned in GET /users/:id. Recommendation: Never return passwords; store and compare using bcrypt/argon2. Hash on create/update.
- JWT: Likely minimal claims and long expiry. Recommendation: Short expiry (15–30 min), refresh tokens, include sub, exp, iat; validate signature and claims server-side.
- Auth model: Single shared secret for all users. Recommendation: Per-user credentials, role-based access if needed.
- HTTPS/SSL: Service runs over HTTP. Recommendation: Use HTTPS in production; terminate TLS at load balancer or reverse proxy, or enable SSL/TLS on the service.
- CORS: Unknown. Recommendation: Explicit Access-Control-Allow-Origin for known frontend origins.
- Rate limiting: None. Recommendation: Rate limit /token, /users, /acquisitions to reduce brute-force and abuse.

Validation and error handling

- Input validation: Minimal. Recommendation: Validate body/query; enforce length, format, types; reject invalid input early.
- Error responses: Likely inconsistent. Recommendation: Standard JSON errors with correct HTTP status codes (400, 401, 403, 404, 500).
- Validation messages: Unclear. Recommendation: Clear, safe messages for clients; avoid leaking internals.

Schema and API design

- Field naming: sites in docs vs ore_sites in response. Recommendation: Align docs and response schema; use OpenAPI/Swagger for source of truth.
- Pagination: /acquisitions returns ~300 items. Recommendation: Add limit and offset (or cursor) for scalability.
- Filtering: None. Recommendation: Add from and to for acquisitions; search for users if needed.
- Versioning: None. Recommendation: Path prefix or header versioning for backward compatibility.

Operational

- Health checks: Unknown. Recommendation: GET /health or /ready for liveness/readiness probes.
- Logging: Unknown. Recommendation: Structured logs (request id, user, status, duration) without sensitive data.
- Metrics: None. Recommendation: Basic metrics (latency, error rate) for monitoring and alerting.

Data and storage

- Persistence: Likely in-memory. Recommendation: Use a database (Postgres, SQLite) for users and acquisitions.
- Idempotency: Unknown. Recommendation: Idempotency keys for POST updates where applicable.

Scaling and high-volume data

As satellites and data volume grow, the current design may hit limits. Possible improvements:

- Async ingestion via message queue (Kafka, RabbitMQ)
- Time-series storage (TimescaleDB, InfluxDB, ClickHouse)
- Partitioning and retention policies
- Separate transactional DB for users vs time-series for acquisitions
- Pagination, cursors, range filters, streaming for exports
- Caching (e.g. Redis) for pre-computed stats
- Read/write separation and replicas
- Event-driven model, optional CQRS
- Observability: tracing, metrics, structured logging
- Backpressure and rate limiting at ingest

---

9. Frontend Enhancements (Future)

If there were more time, the frontend could be improved with:

- UX polish: Better animations, transitions, accessibility (ARIA, keyboard nav)
- Responsiveness: Further mobile layout tuning, larger tap targets
- Advanced viz: More chart types, drill-downs, zoom/pan
- State management: TanStack Query if more complex data flows or caching are needed
- Offline / PWA: Service worker, basic offline support
- i18n: Localization for multiple languages
- E2E against real API: Optional job using docker compose to test against the real backend

---

License

See LICENSE.
