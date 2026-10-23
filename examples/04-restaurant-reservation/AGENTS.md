# Workspace Rules — Restaurant Table Reservation (`04-restaurant-reservation`)

## Overview
Full-stack Node.js & React application for managing restaurant tables, checking slot availability, and booking/managing guest reservations.

## Repository Structure
- `packages/shared/contracts.json`: Single source of truth for allowed `timeSlots`, `zones`, `reservationStatuses`, and entity schemas (`Table`, `Reservation`).
- `apps/api/`: Node.js REST API (`node:http`, ESM) serving `/api/v1/*` on port `4000`, with automated tests using `node --test`.
- `apps/web/`: React 19 + Vite frontend running on port `5173` (proxying `/api` to `http://localhost:4000`).
- `docs/adding-functionality-guide.md`: Detailed architectural walkthrough and step-by-step recipes for extending the app.

## Key Commands
- **Run API unit & integration tests:** `npm --prefix apps/api test`
- **Build React frontend:** `npm --prefix apps/web run build`
- **Run full workspace verification:** `./.agents/skills/add-reservation-feature/scripts/verify-fullstack.sh`
- **Start both API and React frontend:** `npm start`

## Cross-Cutting Engineering Principles
1. **Contract-First Changes:** Whenever adding new fields, statuses, or resources, update `packages/shared/contracts.json` first.
2. **No Double-Booking:** A table cannot have two active (`confirmed` or `seated`) reservations on the same `date` and `timeSlot`. Cancelled reservations release the slot.
3. **Capacity Enforcement:** `partySize` must be between `1` and `table.capacity`.
4. **Scoped Rules:** Obey `apps/api/AGENTS.md` when working on backend files and `apps/web/AGENTS.md` when working on React components.
5. **Test Before Completion:** Always run `npm --prefix apps/api test` and `npm --prefix apps/web run build` before finishing any feature change.
