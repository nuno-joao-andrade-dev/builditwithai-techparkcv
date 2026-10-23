---
name: add-reservation-feature
description: >-
  Guides end-to-end implementation of new restaurant reservation features across the shared
  JSON contract (packages/shared/contracts.json), the Node.js API (apps/api), automated tests
  (apps/api/tests/api.test.js), and the React frontend (apps/web). Activate this skill whenever
  asked to add a new feature, endpoint, filter, waitlist, or field to the reservation system.
---

# Add Full-Stack Reservation Feature Skill

Follow these 5 steps in order whenever adding or extending functionality in `04-restaurant-reservation`:

## Step 1: Update the Shared Contract (`packages/shared/contracts.json`)
1. Inspect `packages/shared/contracts.json`.
2. Add any new enum values, fields, or entity definitions so both backend and frontend share the same specification.
3. Read [feature-architecture-guide.md](./references/feature-architecture-guide.md) for data flow details and layer responsibilities.

## Step 2: Implement Backend Validation & Store Logic (`apps/api/src/`)
1. Add pure input validation in `apps/api/src/validators.js`.
2. Add state transitions and domain checks (`DomainError` with `400`, `404`, or `409`) in `apps/api/src/store.js`.
3. Expose the HTTP route in `apps/api/src/app.js` using `sendSuccess(res, statusCode, data, requestId)`.

## Step 3: Add Automated Backend Tests (`apps/api/tests/api.test.js`)
1. Add integration test cases covering both the happy path and validation/conflict error paths in `apps/api/tests/api.test.js`.
2. Run `npm --prefix apps/api test` to verify all tests pass.

## Step 4: Wire Up the React Frontend (`apps/web/src/`)
1. Add the client function in `apps/web/src/api.js`.
2. Update state, form controls, or schedule views in `apps/web/src/App.jsx` (and styles in `apps/web/src/styles.css` if needed).
3. Ensure `loadData()` is called after mutations so availability and reservations stay synchronized.

## Step 5: Run Full-Stack Verification
Execute the verification script and ensure zero errors before completing the task:
```bash
./.agents/skills/add-reservation-feature/scripts/verify-fullstack.sh
```
