---
name: init-project
description: >-
  Initializes a brand-new software project from this 00-project-boilerplate template.
  Use this skill when the user wants to kick off, bootstrap, or configure a new project,
  replace the [TODO: ...] placeholders in AGENTS.md and docs/, and scaffold the initial src/ and tests/ files.
---

# Project Initialization Skill (`init-project`)

Follow this step-by-step workflow to turn this boilerplate into a fully configured, working project tailored to the user's requirements.

## Step 1: Audit Current Boilerplate State
Run the verification script to inspect the boilerplate structure and see which files still contain `[TODO:` placeholders:
```bash
./.agents/skills/init-project/scripts/check-boilerplate.sh
```

## Step 2: Gather or Confirm Project Requirements
If the user has not yet specified the following details, ask brief, targeted questions (or use `/grill-me`):
1. **Project Goal & MVP Scope:** What does the application or service do?
2. **Language & Runtime:** (e.g., Node.js 22+, Python 3.12+, TypeScript, Go).
3. **Framework & Storage:** (e.g., Express/Fastify, React, FastAPI, SQLite, PostgreSQL, or zero-dependency stdlib).
4. **Canonical Test Command:** (e.g., `npm test`, `python3 -m unittest`, `pytest`).

## Step 3: Populate Documentation & Rules (Remove All `[TODO: ...]`)
Update the four core governance files so they contain concrete, project-specific rules and zero `[TODO:` markers:
1. [`AGENTS.md`](../../../AGENTS.md): Fill in Project Overview, Canonical Commands (`install`, `test`, `lint`), and Core Engineering Invariants.
2. [`docs/product-spec.md`](../../../docs/product-spec.md): Fill in Problem Statement, MVP User Stories (`US-01`..`US-03`), Explicit Non-Goals, and Domain Glossary.
3. [`docs/architecture.md`](../../../docs/architecture.md): Document the chosen module layout in `src/` and domain invariants.
4. [`docs/adr/0001-initial-architecture-and-stack.md`](../../../docs/adr/0001-initial-architecture-and-stack.md): Record the chosen stack and rationale.

## Step 4: Scaffold Initial Source (`src/`) and Automated Tests (`tests/`)
1. Create the initial entrypoint and core domain module inside `src/`.
2. Create a matching unit/integration test file inside `tests/` covering at least one happy path and one validation/error case.
3. Execute the canonical test command defined in `AGENTS.md` and confirm it passes (`exit 0`).

## Step 5: Final Verification Against Initialization Checklist
1. Read [initialization-checklist.md](./references/initialization-checklist.md).
2. Re-run `./.agents/skills/init-project/scripts/check-boilerplate.sh` to confirm that all required files exist and `0` unresolved `[TODO:` placeholders remain.
