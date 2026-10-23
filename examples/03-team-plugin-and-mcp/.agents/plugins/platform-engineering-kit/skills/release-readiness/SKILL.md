---
name: release-readiness
description: >-
  Evaluates whether a service is ready for production deployment against the team's
  release gate criteria. Use this skill when the user asks to verify release readiness
  or prepare a production deployment checklist.
---

# Release Readiness Skill

1. Read the mandatory gate criteria in [release-gate-criteria.md](./references/release-gate-criteria.md).
2. Verify that all unit tests, migration checks, and rollback plans are documented.
3. Output a **Release Gate Scorecard** (`PASS` / `BLOCKED`) with evidence for each gate.
