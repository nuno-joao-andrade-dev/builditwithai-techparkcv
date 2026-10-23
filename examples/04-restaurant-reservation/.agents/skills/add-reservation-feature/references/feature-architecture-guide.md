# Full-Stack Feature Architecture Reference

## Request & Data Flow

```text
[React UI: apps/web/src/App.jsx]
       │
       ▼ (calls helper function)
[API Client: apps/web/src/api.js]
       │
       ▼ HTTP JSON (/api/v1/* proxied by Vite to :4000)
[HTTP Router: apps/api/src/app.js]
       │
       ├──► [Validators: apps/api/src/validators.js] ◄── [packages/shared/contracts.json]
       │
       ▼
[Domain Store: apps/api/src/store.js]
```

## Layer Responsibilities

1. **`packages/shared/contracts.json`**:
   - Defines canonical `timeSlots`, `zones`, `reservationStatuses`, and JSON schemas.
   - Loaded directly at runtime by `apps/api/src/validators.js`.
2. **`apps/api/src/validators.js`**:
   - Validates query parameters and JSON request bodies before touching store state.
   - Always returns `{ valid: boolean, errors: string[], value: object }`.
3. **`apps/api/src/store.js`**:
   - Holds `ReservationStore` state (`this.tables`, `this.reservations`).
   - Enforces domain invariants (`CAPACITY_EXCEEDED` -> `400`, `TABLE_NOT_FOUND` -> `404`, `TABLE_ALREADY_BOOKED` -> `409`).
4. **`apps/api/src/app.js`**:
   - Maps HTTP method + URL pattern to validator + store method.
   - Wraps every response in `{ data, meta: { requestId, timestamp } }` or `{ error: { code, message }, meta }`.
5. **`apps/web/src/api.js` & `apps/web/src/App.jsx`**:
   - `api.js` unwraps `payload.data` and throws `Error(payload.error.message)` on non-2xx responses.
   - `App.jsx` renders the filter bar, floor plan availability grid, booking form, and reservations table.
