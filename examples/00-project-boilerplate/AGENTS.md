# Workspace Rules (`AGENTS.md`)

> **Instructions for the AI Agent (`agy`):**
> This file is the root source of truth for this repository.
> - If this project is still a fresh copy of `00-project-boilerplate` (containing `[TODO: ...]` placeholders below), use the **`init-project` skill** (`.agents/skills/init-project/SKILL.md`) to replace every `[TODO: ...]` placeholder with concrete project settings once the user describes their project.
> - Keep this file concise (**under 100 lines**). Put detailed reference guides inside `docs/` and multi-step workflows inside `.agents/skills/`.

## 1. Project Overview & Tech Stack
- **Project Name:** `[TODO: e.g., billing-service / task-tracker]`
- **Primary Language & Runtime:** `[TODO: e.g., Node.js 22+ / Python 3.12+ / Go 1.23+]`
- **Framework & Libraries:** `[TODO: e.g., Fastify + React / FastAPI / Standard Library only]`
- **Database / Storage:** `[TODO: e.g., PostgreSQL / SQLite / In-memory store]`

## 2. Canonical Commands (Verify Before Completing Any Task)
Always use these exact commands to verify your changes:
- **Install dependencies:** `[TODO: e.g., npm install / pip install -r requirements.txt]`
- **Run unit & integration tests:** `[TODO: e.g., npm test / pytest / python3 -m unittest]`
- **Run linter / typecheck:** `[TODO: e.g., npm run lint / ruff check . && mypy src]`
- **Verify boilerplate & docs structure:** `./.agents/skills/init-project/scripts/check-boilerplate.sh`

## 3. Repository Structure & Documentation Map
Before implementing a new feature or changing system boundaries, consult the relevant document:
- **Product Requirements & Scope:** [`docs/product-spec.md`](./docs/product-spec.md)
- **System Architecture & Boundaries:** [`docs/architecture.md`](./docs/architecture.md)
- **Coding & Testing Conventions:** [`docs/conventions.md`](./docs/conventions.md)
- **Architecture Decision Records (ADRs):** [`docs/adr/`](./docs/adr/)
- **Source Code:** [`src/`](./src/)
- **Automated Tests:** [`tests/`](./tests/)

## 4. Core Engineering Invariants
1. **Plan Before Coding:** For non-trivial features, verify requirements against `docs/product-spec.md` and `docs/architecture.md` before creating or editing source files in `src/`.
2. **No Silent Contract Changes:** Any change to public APIs, CLI flags, or data models must be reflected in documentation and covered by tests in `tests/`.
3. **Strict Input Validation & Error Handling:** Validate all external inputs at the boundary layer and return structured, actionable error messages.
4. **Minimal Dependencies:** Do not add third-party packages without explicit user approval; prefer standard library capabilities whenever practical.
5. **Completion Gate:** Never mark a task complete until the test command in Section 2 exits with status code `0`.
