# Logistics Shipment Tracker

A small full-stack CRUD application for recording shipments and tracking their delivery status, built as an entry-level coding assignment. Backend is a Java/Spring Boot REST API backed by PostgreSQL; frontend is a React single-page app; everything runs via Docker Compose.

## 1. Implemented Features

- Create, view, edit, and delete shipments
- View a single shipment's full detail (including `createdAt` / `updatedAt`)
- Filter the shipment list by status, with an "All" option
- Delete requires a confirmation dialog
- Backend validation on every field, with consistent JSON error responses
- Duplicate tracking numbers rejected with `409 Conflict`
- Unknown shipment IDs return `404 Not Found`
- Frontend shows loading, empty, validation, and error states
- Submit button disabled while a save is in flight, to avoid duplicate submissions

## 2. Architecture / Technology Summary

| Layer | Technology |
| --- | --- |
| Backend | Java 21, Spring Boot 4.1.1, Spring Web, Spring Data JPA, Bean Validation, Flyway |
| Database | PostgreSQL 16 |
| Frontend | React 18, Vite, React Router, Axios |
| Backend tests | JUnit 5, Mockito, MockMvc, Testcontainers (PostgreSQL) |
| Frontend tests | Vitest, React Testing Library |
| Runtime | Docker, Docker Compose |

**Backend** follows a conventional layered design: `Controller` → `Service` → `Repository` → `Entity`, with separate request/response DTOs (`ShipmentRequest` / `ShipmentResponse`) mapped via `ShipmentMapper` — the JPA entity is never returned directly from the API. A `@RestControllerAdvice` (`GlobalExceptionHandler`) centralizes error handling into a consistent JSON shape.

**Note on Spring Boot version:** the project was generated via Spring Initializr with Spring Boot **4.1.1** (not the 3.x line named in the original assignment brief). This was a generator default rather than a deliberate choice. Boot 4 restructured several packages relevant here — `@WebMvcTest` moved to `org.springframework.boot.webmvc.test.autoconfigure`, `@MockBean` was replaced by `@MockitoBean`, and Jackson moved from `com.fasterxml.jackson.*` to `tools.jackson.*` (Jackson 3). Functionally everything required by the assignment (Spring Web, Spring Data JPA, Bean Validation, Flyway, JUnit 5, Mockito) is present and working; this is noted here in case it comes up in review.

**Frontend** keeps all API access inside `src/api/shipmentApi.js` (a single Axios instance) rather than calling the API from components directly. The API base URL is read from `VITE_API_BASE_URL` at build time — never hardcoded — since Vite bakes environment variables into the bundle when it's built, not at container runtime.

## 3. Prerequisites

- Docker
- Docker Compose (bundled with recent Docker Desktop / Docker Engine as `docker compose`)

No local installation of Java, Maven, Node, or PostgreSQL is required to run the application.

## 4. Running the Complete Application

```bash
git clone <repository-url>
cd <repository-folder>
docker compose up --build
```

This starts, in order: PostgreSQL (with a health check), the Spring Boot backend (which waits for Postgres to be healthy, then runs Flyway migrations automatically), and the React frontend.

### Ports

The assignment's recommended ports are the defaults: frontend `3000`, backend `8080`, PostgreSQL `5432`. If any of those are already in use on your machine, override them without touching `docker-compose.yml`:

```bash
cp .env.example .env
# edit .env, e.g. BACKEND_HOST_PORT=8082, DB_HOST_PORT=5434
docker compose up --build
```

## 5. URLs

- Frontend: `http://localhost:3000` (or `$FRONTEND_HOST_PORT`)
- Backend API: `http://localhost:8080` (or `$BACKEND_HOST_PORT`)
- Example: `GET http://localhost:8080/api/shipments`

## 6. Stopping the Application

```bash
docker compose down
```

Add `-v` to also remove the named Postgres volume (this deletes all persisted shipment data):

```bash
docker compose down -v
```

## 7. Running Backend Tests

The backend has no local Maven install requirement — tests run inside a Maven container. From the repository root:

```bash
docker run --rm \
  -v "$(pwd)/backend:/app" \
  -v "$(pwd)/.m2-cache:/root/.m2" \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -w /app \
  maven:3.9-eclipse-temurin-21 \
  mvn test
```

If you have Java 21 and Maven installed locally, this is equivalent to simply running `mvn test` from inside `backend/`.

**Important:** the repository-layer tests (`ShipmentRepositoryTest`) use [Testcontainers](https://testcontainers.com/) to spin up a real, disposable PostgreSQL container per test run. **Docker must be running** on whatever machine executes the tests (the `-v /var/run/docker.sock:/var/run/docker.sock` mount above gives the test container access to the host's Docker daemon so it can launch its own containers). Service-layer tests (Mockito) and controller tests (MockMvc) do not need a database at all.

13 backend tests in total:
- 5 service-layer tests (Mockito) — creation, default status, duplicate rejection, not-found, status filtering
- 5 controller tests (MockMvc) — 201/400/404/409/204 status codes
- 3 repository tests (Testcontainers + real Postgres) — status filtering, empty results, duplicate detection

## 8. Running Frontend Tests

```bash
cd frontend
npm install
npm run test
```

(Requires Node 18+; if you don't have Node locally, run the same commands inside a `node:20-alpine` container with the `frontend/` directory mounted.)

6 frontend tests: list page loading/empty/error/delete-confirmation states, and form validation/successful-submission behavior.

## 9. Environment Variables

All variables have sensible defaults baked into `docker-compose.yml`; you only need `.env` if you want to override host ports or the database password.

| Variable | Default | Used by | Purpose |
| --- | --- | --- | --- |
| `BACKEND_HOST_PORT` | `8080` | docker-compose | Host port mapped to the backend's container port 8080 |
| `FRONTEND_HOST_PORT` | `3000` | docker-compose | Host port mapped to the frontend's container port 3000 |
| `DB_HOST_PORT` | `5432` | docker-compose | Host port mapped to Postgres's container port 5432 |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | see `docker-compose.yml` | backend | Postgres connection, injected by Compose |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | backend | Allowed CORS origin |
| `VITE_API_BASE_URL` | `http://localhost:8080` | frontend (build-time) | Base URL the browser uses to reach the API |

Copy `.env.example` to `.env` to override any of the host-port variables locally.

## 10. Example API Requests

**Create a shipment:**
```bash
curl -X POST http://localhost:8080/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumber": "SHP-1001",
    "senderName": "North Warehouse",
    "receiverName": "City Pharmacy",
    "origin": "Leeds",
    "destination": "London",
    "carrier": "QuickMove Logistics",
    "expectedDeliveryDate": "2026-12-01"
  }'
```

**List shipments, filtered by status:**
```bash
curl "http://localhost:8080/api/shipments?status=IN_TRANSIT"
```

**Get, update, delete a specific shipment:**
```bash
curl http://localhost:8080/api/shipments/1
curl -X PUT http://localhost:8080/api/shipments/1 -H "Content-Type: application/json" -d '{...}'
curl -X DELETE http://localhost:8080/api/shipments/1
```

## 11. Assumptions and Design Decisions

- **`expectedDeliveryDate` validation**: the spec requires this date not be earlier than the shipment's *creation* date. Since creation happens at the moment of the request, this is implemented as "must not be before today" (`@FutureOrPresent`) rather than comparing against the stored `createdAt` in the service layer. This keeps create and edit consistent and avoids blocking legitimate edits to a shipment whose delivery date has since passed (e.g. correcting an overdue shipment's status).
- **Host ports are configurable** via `.env` (see section 9) rather than fixed to 3000/8080/5432, since those ports may already be in use on a given machine. Defaults still match the assignment's recommendation.
- **`serve` (npm package)** is used to host the built frontend static files in production, rather than nginx — simpler Dockerfile, no nginx config to maintain, adequate for this assignment's scope.
- **Lombok was not used** — the Spring Initializr project used to bootstrap this repo didn't include it, and all getters/setters were written out explicitly instead of retrofitting it afterward.

## 12. Known Limitations / Incomplete Work

- No pagination — the shipment list loads all records at once. Fine at small scale; would need pagination (e.g. Spring Data `Pageable` + a paged React list) before this could handle a large dataset.
- No optimistic concurrency control on updates — two simultaneous edits to the same shipment will both succeed, with the second write silently overwriting the first (last-write-wins). Two *simultaneous creates* with the same tracking number are handled correctly: the database's `UNIQUE` constraint on `tracking_number` is the real guard (not just the service-layer pre-check, which has a narrow race window), and `GlobalExceptionHandler` maps the resulting `DataIntegrityViolationException` to a `409 Conflict`, same as the normal duplicate path.
- No search by tracking number (listed as an optional enhancement in the spec, not implemented here).
- No OpenAPI/Swagger documentation.

## 13. Troubleshooting

**"port is already allocated" when running `docker compose up`**
Something else on your machine (another project, a local Postgres install) is already using 3000, 8080, or 5432. Copy `.env.example` to `.env` and change the conflicting `*_HOST_PORT` value, then re-run `docker compose up --build`.

**Backend container exits immediately / Flyway migration error**
Check `docker compose logs backend`. If Postgres wasn't ready yet, the `depends_on: condition: service_healthy` should already prevent this — but if you're re-using an old Postgres volume with an incompatible schema, run `docker compose down -v` to remove the volume and start clean.

**Frontend loads but shows a network error / can't reach the API**
The API base URL is baked into the frontend bundle *at build time*. If you changed `BACKEND_HOST_PORT` after already building the frontend image, rebuild it: `docker compose up --build frontend`.

**Backend tests fail with a Docker-related error**
The repository tests use Testcontainers, which needs its own access to the Docker daemon. Make sure Docker is running, and if running tests inside a container, mount the host's Docker socket (`-v /var/run/docker.sock:/var/run/docker.sock`) as shown in section 7.

## 14. Use of AI Assistance

This project was built with Claude (Anthropic) as a pair-programming assistant, inside a live conversation where the user reviewed each step and ran commands themselves for part of the session. Specifically:

- **Code generation**: Claude wrote the initial backend layers (entity, DTOs, mapper, repository, service, controller, exception handling), the frontend (API service module, pages, components, styling), Dockerfiles, `docker-compose.yml`, and test suites (JUnit/Mockito/MockMvc/Testcontainers on the backend, Vitest/RTL on the frontend).
- **Verification**: every layer was actually compiled and run, not just written. The backend was built and its full test suite executed inside Docker containers at each stage; the frontend was built with Vite and its test suite run under Node 20; the complete stack was brought up with `docker compose up --build` and exercised end-to-end via `curl` against all six REST endpoints (201/200/400/404/409/204 responses all confirmed against a real Postgres database, not mocks).
- **Bugs found and fixed during verification**: a missing `CREATE` keyword in the Flyway migration (caught when the backend failed to start against real Postgres), a truncated Java source file missing its package/import/class-declaration lines, and Spring Boot 4-specific API changes (`@MockBean` → `@MockitoBean`, relocated `@WebMvcTest` package, Jackson 3's package rename) that only surfaced once the code was actually compiled — none of these would have been caught by code review alone.
- **What was not independently re-derived**: the overall project structure, choice of libraries, and API design closely follow the assignment brief's explicit requirements rather than independent judgment calls.

All code in this repository should be treated as AI-assisted and was verified by actually running it, not merely inspected.
