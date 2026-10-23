# Frontend React Rules (`apps/web/AGENTS.md`)

These rules apply to `apps/web/` and supplement the root `AGENTS.md`.

## Commands
- **Install dependencies:** `npm --prefix apps/web install`
- **Start dev server:** `npm --prefix apps/web run dev`
- **Production build check:** `npm --prefix apps/web run build`

## Frontend Coding Conventions
1. **Centralized API Client:** Keep all `fetch()` calls inside `src/api.js`. Never hardcode `fetch('/api/v1/...')` directly inside UI components.
2. **Explicit UI States:** Every data-driven section must handle `loading`, `error`, and `empty` states clearly and provide accessible feedback (`role="alert"`, `aria-live="polite"`).
3. **Synchronized Refresh:** After creating, seating, or cancelling a reservation, refresh both the table availability grid and the reservation list so the UI remains consistent without requiring a browser reload.
4. **Semantic Markup:** Use semantic HTML (`header`, `main`, `section`, `form`, `label`, `button`, `table`) and associate every form `<input>` or `<select>` with a `<label htmlFor="...">`.
