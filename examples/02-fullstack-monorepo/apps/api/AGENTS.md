# Backend API Rules (`apps/api/AGENTS.md`)

These rules apply specifically to `apps/api/` and supplement the root `AGENTS.md`.

## Commands
- **Syntax check:** `python3 -m py_compile apps/api/src/routes.py`
- **Validate SQL migration:** `./.agents/skills/db-migration/scripts/validate-sql.sh apps/api/migrations/<file>.sql`

## Backend Coding Conventions
- Use Python 3.11+ type hints (`dict[str, Any]`, `list[dict[str, str]]`).
- Every endpoint function in `src/routes.py` must accept a `request_id: str` parameter and include `"meta": {"requestId": request_id}` in its returned dictionary.
- Never return raw database rows directly; map fields to camelCase keys matching `packages/shared/schemas.json`.
