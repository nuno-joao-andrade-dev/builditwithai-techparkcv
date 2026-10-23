# System Architecture (`docs/architecture.md`)

> **Agent Instruction:** Consult this document before adding new modules, directories, or external integrations. Keep module dependencies flowing in one direction.

## 1. High-Level Architecture

```text
[ External Client / CLI / UI ]
              │
              ▼
   [ Transport / Entrypoint ]     (Input validation, HTTP/CLI parsing, formatting)
              │
              ▼
      [ Domain / Service ]        (Pure business logic & domain invariants in src/)
              │
              ▼
    [ Storage / Repository ]      (Persistence & external adapters)
```

## 2. Module Responsibilities (`src/` & `tests/`)
- **`src/` (Application Source):**
  - **Entrypoint / Transport Layer:** Handles HTTP routes, CLI arguments, or UI events. Must not contain raw business rules.
  - **Domain / Business Logic Layer:** Enforces domain invariants and calculations. Kept pure and deterministic so it can be unit-tested without network or disk I/O.
  - **Data / Adapter Layer:** Encapsulates file system, database, or external API calls.
- **`tests/` (Automated Test Suite):**
  - Mirrors the structure of `src/`.
  - Every public function or endpoint must have both happy-path and edge-case/error-path tests.

## 3. Domain Invariants & Cross-Cutting Rules
- **Data Integrity:** `[TODO: e.g., Monetary values stored as integer cents; timestamps in ISO-8601 UTC.]`
- **Error Envelope:** `[TODO: e.g., All errors return a consistent code and human-readable message.]`
- **Security & Secrets:** Never hardcode API keys, tokens, or credentials in source files; read configuration from environment variables.
