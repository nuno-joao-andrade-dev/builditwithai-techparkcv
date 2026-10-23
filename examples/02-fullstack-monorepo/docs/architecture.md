# Fullstack Monorepo Architecture

## System Data Flow

```text
+-----------------------+        HTTP JSON (/v1/*)        +-----------------------+
|   apps/web (React)    | ------------------------------> |   apps/api (Python)   |
+-----------------------+                                 +-----------------------+
            \                                                        /
             \---- Validates against packages/shared/schemas.json --/
```

## Components
1. **Web Client (`apps/web/`):** Renders project dashboards and consumes `/v1/*` JSON endpoints.
2. **API Service (`apps/api/`):** Exposes RESTful JSON endpoints and manages PostgreSQL migrations under `apps/api/migrations/`.
3. **Shared Contracts (`packages/shared/schemas.json`):** Single source of truth for API entity shapes.
