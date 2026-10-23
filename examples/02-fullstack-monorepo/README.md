# 02 — Fullstack Monorepo (Hierarchical Rules, Skills & Quality Hooks)

This example demonstrates how to structure a **multi-service brownfield monorepo** (`apps/api`, `apps/web`, `packages/shared`) to scale AI-assisted software engineering across backend and frontend stacks without overflowing the model's context window.

---

## 1. Key Concepts Demonstrated

1. **Hierarchical Directory Rules (`AGENTS.md`):**
   - [`AGENTS.md`](./AGENTS.md): Root rules shared across the entire monorepo (contract-first rule, naming conventions).
   - [`apps/api/AGENTS.md`](./apps/api/AGENTS.md): Python / FastAPI backend rules loaded **only** when working inside `apps/api/` (requires `request_id: str` parameter, `{"data": ..., "meta": {"requestId": ...}}` envelope, and `camelCase` JSON keys matching `packages/shared/schemas.json`).
   - [`apps/web/AGENTS.md`](./apps/web/AGENTS.md): TypeScript / React frontend rules loaded **only** when working inside `apps/web/` (strict TypeScript interfaces, `data-*` test attributes, semantic HTML).
2. **Progressive Disclosure Skills (`.agents/skills/`):**
   - [`db-migration`](./.agents/skills/db-migration/SKILL.md): Complete skill package with `scripts/validate-sql.sh`, `examples/001_create_users.sql`, and `references/zero-downtime-migrations.md`.
   - [`api-endpoint-scaffold`](./.agents/skills/api-endpoint-scaffold/SKILL.md): Guides the agent through updating `packages/shared/schemas.json` first, implementing the handler in `apps/api/src/routes.py`, and verifying against `resources/endpoint-checklist.md`.
3. **Deterministic Lifecycle Hooks (`.agents/hooks.json`):**
   - `PreToolUse` (`command-guard.sh`): Blocks destructive `DROP DATABASE`, `DROP TABLE`, and `rm -rf` commands before execution.
   - `PostToolUse` (`post-edit-check.sh`): Automatically compiles edited `.py` files (`python3 -m py_compile`) after every `edit_file` or `write_file` call.

---

## 2. Directory Structure

```text
02-fullstack-monorepo/
├── README.md                                      # This step-by-step guide
├── AGENTS.md                                      # Global monorepo rules
├── docs/
│   ├── architecture.md                            # Data-flow & service boundary architecture
│   └── conventions.md                             # Naming & contract synchronization rules
├── .agents/
│   ├── hooks.json                                 # PreToolUse & PostToolUse hooks
│   ├── scripts/
│   │   ├── command-guard.sh                       # Blocks DROP TABLE/DATABASE & rm -rf
│   │   └── post-edit-check.sh                     # Runs py_compile after file edits
│   └── skills/
│       ├── db-migration/
│       │   ├── SKILL.md
│       │   ├── scripts/validate-sql.sh            # Static zero-downtime SQL linter
│       │   ├── examples/001_create_users.sql      # Reference SQL migration
│       │   └── references/zero-downtime-migrations.md
│       └── api-endpoint-scaffold/
│           ├── SKILL.md
│           ├── examples/route-example.py          # Canonical route handler pattern
│           └── resources/endpoint-checklist.md    # Pre-completion verification checklist
├── apps/
│   ├── api/
│   │   ├── AGENTS.md                              # Contextual Backend Rules
│   │   ├── migrations/001_create_users.sql
│   │   └── src/routes.py
│   └── web/
│       ├── AGENTS.md                              # Contextual Frontend Rules
│       └── src/App.tsx
└── packages/
    └── shared/
        └── schemas.json                           # Single source of truth for API schemas
```

---

## 3. Step-by-Step Instructions & What to Expect

Follow these four hands-on exercises to test every feature of this monorepo configuration.

---

### Exercise 1: Run the SQL Migration Validator (`validate-sql.sh`) Manually

The `db-migration` skill includes an executable static validator that checks SQL files for required metadata headers and prohibited destructive statements (`DROP TABLE` without safety guards or `TRUNCATE TABLE`).

#### Instructions
1. Open your terminal and navigate to this example:
   ```bash
   cd examples/02-fullstack-monorepo
   ```
2. Run the validator against the existing baseline migration:
   ```bash
   ./.agents/skills/db-migration/scripts/validate-sql.sh apps/api/migrations/001_create_users.sql
   ```
3. Verify the existing Python backend routes compile cleanly:
   ```bash
   python3 -m py_compile apps/api/src/routes.py && echo "Syntax OK"
   ```

#### What to Expect
- Step 2 prints:
  ```text
  Validating migration: apps/api/migrations/001_create_users.sql
  [PASS] Migration apps/api/migrations/001_create_users.sql passed all static zero-downtime checks.
  ```
- Step 3 prints:
  ```text
  Syntax OK
  ```

---

### Exercise 2: Create a Zero-Downtime SQL Migration Using `agy` (`db-migration` Skill)

Now let's launch `agy` and ask it to create a new database migration.

#### Instructions
1. Start `agy` inside `examples/02-fullstack-monorepo`:
   ```bash
   agy
   ```
2. Enter the following prompt:
   ```text
   Create a new zero-downtime migration 002_add_projects_table.sql in apps/api/migrations/ for a projects table (id, name, owner_user_id, created_at) and validate it.
   ```

#### What to Expect
1. **Skill Activation (`db-migration`):**
   - `agy` matches your prompt against `.agents/skills/db-migration/SKILL.md` (`"Creates and validates zero-downtime SQL database migrations under apps/api/migrations/..."`).
2. **Progressive Resource Loading:**
   - Following `SKILL.md` Step 1 & Step 2, the agent inspects `apps/api/migrations/001_create_users.sql`, `.agents/skills/db-migration/examples/001_create_users.sql`, and `.agents/skills/db-migration/references/zero-downtime-migrations.md`.
3. **File Generation (`apps/api/migrations/002_add_projects_table.sql`):**
   - The agent creates `apps/api/migrations/002_add_projects_table.sql` with:
     - Required header comments: `-- Migration: 002_add_projects_table` and `-- Strategy: Expand-only (zero-downtime compatible)`
     - Idempotent DDL: `CREATE TABLE IF NOT EXISTS projects (...)` and `CREATE INDEX IF NOT EXISTS ...`
4. **Automated Validation Execution:**
   - Following `SKILL.md` Step 3, the agent runs:
     ```bash
     ./.agents/skills/db-migration/scripts/validate-sql.sh apps/api/migrations/002_add_projects_table.sql
     ```
   - You will see `[PASS] Migration apps/api/migrations/002_add_projects_table.sql passed all static zero-downtime checks.` in the tool output before the agent finishes its response.

---

### Exercise 3: Scaffold a Full-Stack Endpoint Across Hierarchical `AGENTS.md` Files

Next, let's ask the agent to add a new `/v1/projects` endpoint in the backend and a consumer function in the frontend so we can see **Contract-First Development**, **Hierarchical Rules**, and the **`PostToolUse` Hook** work together.

#### Instructions
Inside your running `agy` session, enter:

```text
Add a GET /v1/projects endpoint (`list_projects`) to apps/api/src/routes.py and add a `ProjectSummary` interface and `renderProjectRow` helper in apps/web/src/App.tsx.
```

#### What to Expect
Watch the sequence of steps the agent takes:

1. **Contract-First Update (`packages/shared/schemas.json`):**
   - Guided by root `AGENTS.md` (*"Never add or modify an API endpoint in `apps/api` without updating `packages/shared/schemas.json` first"*) and the `api-endpoint-scaffold` skill, the agent first adds a `"Project"` schema definition (with `id`, `name`, `ownerUserId` in `camelCase`) to `packages/shared/schemas.json`.
2. **Scoped Backend Rules (`apps/api/AGENTS.md`) + `PostToolUse` Hook:**
   - When the agent reads/edits `apps/api/src/routes.py`, `apps/api/AGENTS.md` is active.
   - The generated `list_projects(request_id: str) -> dict[str, Any]` function will:
     - Accept `request_id: str` and include full Python type annotations.
     - Map database `snake_case` fields (`owner_user_id`) to `camelCase` (`ownerUserId`) in the response dictionary.
     - Return the required envelope:
       ```python
       return {
           "data": projects,
           "meta": {
               "requestId": request_id,
               "count": len(projects),
           },
       }
       ```
   - Immediately after `edit_file` modifies `apps/api/src/routes.py`, the **`PostToolUse` hook** (`.agents/scripts/post-edit-check.sh`) runs `python3 -m py_compile` in the background to verify syntax validity.
3. **Scoped Frontend Rules (`apps/web/AGENTS.md`):**
   - When the agent edits `apps/web/src/App.tsx`, `apps/web/AGENTS.md` is active (without polluting the frontend context with Python/SQL rules).
   - The agent adds `export interface ProjectSummary` matching `packages/shared/schemas.json` and implements `renderProjectRow(project: ProjectSummary): string` using semantic HTML (`<tr data-project-id="...">`).

> **Tip:** To reset the files after testing Exercises 2 & 3, run:
> ```bash
> rm -f apps/api/migrations/002_add_projects_table.sql
> git checkout -- packages/shared/schemas.json apps/api/src/routes.py apps/web/src/App.tsx
> ```

---

### Exercise 4: Test the `PreToolUse` Command Guard (`command-guard.sh`)

Let's verify that `.agents/scripts/command-guard.sh` deterministically blocks destructive SQL (`DROP TABLE` / `DROP DATABASE`) and filesystem commands.

#### Instructions
Run these two commands in your terminal:

```bash
# 1. Test a safe command (allowed):
printf '{"tool_name":"run_command","tool_input":{"command":"ls -la apps/api/migrations"}}' \
  | ./.agents/scripts/command-guard.sh

# 2. Test a command containing DROP TABLE (blocked):
printf '{"tool_name":"run_command","tool_input":{"command":"sqlite3 app.db \"DROP TABLE users;\""}}' \
  | ./.agents/scripts/command-guard.sh
```

#### What to Expect
1. The first command outputs:
   ```json
   {"decision":"allow"}
   ```
2. The second command outputs:
   ```json
   {"decision":"deny","reason":"Blocked by monorepo safety hook: DROP DATABASE/TABLE and destructive rm -rf commands are prohibited."}
   ```
   When running inside `agy`, any attempt by the agent to execute `DROP TABLE` or `DROP DATABASE` via `run_command` is immediately rejected with this exact message.
