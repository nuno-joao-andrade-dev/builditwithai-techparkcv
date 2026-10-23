# ADR 0001: Use Modular Monolith and Zero-Dependency Core

- **Status:** Accepted
- **Date:** 2026-10-21

## Context
When starting a new service with AI-assisted coding (`agy`), complex framework boilerplate and slow test runners degrade agent iteration speed and increase hallucination risk.

## Decision
1. We structure the project as a **Modular Monolith** with pure domain logic in `src/`.
2. The core domain layer uses only the Python standard library (`dataclasses`, `decimal`, `typing`) and `unittest` for sub-second test execution without external services.

## Consequences
- **Positive:** Unit tests run in `< 50ms`, enabling the AI agent to verify every edit immediately.
- **Positive:** Zero external setup is required after cloning the repository.
- **Negative:** When persistent storage or HTTP serving is needed later, we will add an explicit adapter layer and record a subsequent ADR (`0002-...`).
