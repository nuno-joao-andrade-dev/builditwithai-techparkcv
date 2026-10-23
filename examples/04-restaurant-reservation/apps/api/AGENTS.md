# Backend API Rules (`apps/api/AGENTS.md`)

These rules apply to `apps/api/` and supplement the root `AGENTS.md`.

## Commands
- **Run tests:** `npm --prefix apps/api test` (runs `node --test tests/api.test.js`)
- **Start server:** `npm --prefix apps/api start` (listens on `PORT` or `4000`)

## Backend Coding Conventions
1. **Standard Library First:** Use native Node.js ESM modules (`node:http`, `node:url`, `node:test`, `node:assert/strict`) so the backend has zero external runtime dependencies.
2. **Response Envelope:**
   - Successful responses must return `{ "data": <payload>, "meta": { "requestId": "<id>", "timestamp": "<iso>" } }`.
   - Error responses must return `{ "error": { "code": "<ERROR_CODE>", "message": "<human readable>" }, "meta": { "requestId": "<id>" } }` with appropriate HTTP status codes (`400`, `404`, `409`, `500`).
3. **Separation of Concerns:**
   - `src/validators.js`: Pure input validation functions returning `{ valid, errors, value }`.
   - `src/store.js`: In-memory state store (`ReservationStore` class) encapsulating tables, reservations, availability calculation, and conflict detection.
   - `src/app.js`: HTTP request router (`createRequestListener(store)`) decoupled from `server.listen()` so tests can spin up ephemeral servers on port `0`.
   - `src/server.js`: Entry point that starts the HTTP server on port `4000`.
4. **Testing Requirement:** Every new route or validation rule in `apps/api/src/` must have corresponding test cases in `apps/api/tests/api.test.js`.
