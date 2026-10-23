---
name: api-endpoint-scaffold
description: >-
  Scaffolds new versioned HTTP API endpoints in apps/api/src/routes.py and synchronizes
  contract definitions in packages/shared/schemas.json. Use this skill when the user asks
  to add, update, or scaffold a backend API route.
---

# API Endpoint Scaffolding Skill

Follow this procedure when adding a new API endpoint to `apps/api`:

## Step 1: Update Shared Contract First
1. Inspect `packages/shared/schemas.json`.
2. Add or update the JSON Schema definition for the resource being exposed.

## Step 2: Implement the Route Handler
1. Follow the handler signature and response envelope shown in [route-example.py](./examples/route-example.py).
2. Add the route implementation to `apps/api/src/routes.py`.

## Step 3: Verify Against Endpoint Checklist
1. Walk through every item in [endpoint-checklist.md](./resources/endpoint-checklist.md).
2. Run `python3 -m py_compile apps/api/src/routes.py` to confirm syntax validity.
