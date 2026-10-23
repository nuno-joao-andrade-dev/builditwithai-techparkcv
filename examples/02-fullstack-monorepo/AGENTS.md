# Monorepo Global Rules (Root AGENTS.md)

## Repository Layout
- `apps/api/`: Python backend service and SQL migrations.
- `apps/web/`: TypeScript / React frontend client.
- `packages/shared/`: Cross-service JSON schemas and shared contracts.
- `docs/`: Architecture overview and cross-cutting engineering conventions.

## Cross-Cutting Engineering Principles
1. **Contract-First Development:** Any change to API payloads between `apps/api` and `apps/web` must be reflected in `packages/shared/schemas.json`.
2. **Strict Layering:** `apps/web` communicates with `apps/api` strictly via versioned HTTP endpoints (`/v1/...`). Never import backend modules into frontend directories.
3. **Database Changes:** Always use the `db-migration` skill when adding or modifying SQL migrations under `apps/api/migrations/`.
4. **Scoped Rules:** Read and obey the local `AGENTS.md` inside `apps/api/` or `apps/web/` when editing files in those directories.
