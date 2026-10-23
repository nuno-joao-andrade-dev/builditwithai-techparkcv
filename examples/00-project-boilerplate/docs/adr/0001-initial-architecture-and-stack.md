# ADR 0001: Initial Architecture and Technology Stack

- **Status:** Accepted
- **Date:** 2026-10-22

## Context
When starting a new AI-First software project, both human engineers and AI coding agents (`agy`) need a clear, documented record of the foundational technology stack, module boundaries, and testing strategy so future changes remain consistent.

## Decision
1. **Architecture Style:** Start with a clean, modular architecture separating transport/entrypoint, domain logic (`src/`), and automated verification (`tests/`).
2. **Primary Runtime & Stack:** `[TODO: Specify chosen language/runtime and reason, e.g., Node.js 22+ with built-in node:test, or Python 3.12+ with unittest/pytest.]`
3. **AI-First Governance:**
   - Root workspace rules live in [`AGENTS.md`](../../AGENTS.md).
   - Multi-step agent workflows live in `.agents/skills/`.
   - Deterministic safety and quality guardrails run via `.agents/hooks.json`.

## Consequences
- **Positive:** Fast local test execution, minimal dependency overhead, and predictable context loading for AI agents.
- **Negative / Trade-offs:** Any future addition of external frameworks or databases requires recording a new ADR (`0002-...`).
