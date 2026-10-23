---
name: project-bootstrap
description: >-
  Verifies the development environment, checks architectural documentation,
  and runs the baseline test suite when onboarding or starting a new feature.
  Use this skill when the user asks to bootstrap, verify, or check the health of the project.
---

# Project Bootstrap & Environment Verification

Follow these steps to verify that the workspace is healthy before starting feature work:

## Step 1: Run Environment Verification Script
Execute the helper script to validate Python version, directory structure, and unit tests:
- Script: [verify-env.sh](./scripts/verify-env.sh)
- Command: `./.agents/skills/project-bootstrap/scripts/verify-env.sh`

## Step 2: Review Architecture & Onboarding Checklist
If you are adding a new module or onboarding a developer, consult the detailed checklist:
- Reference: [onboarding-checklist.md](./references/onboarding-checklist.md)

## Step 3: Report Status
Summarize the Python runtime version, test suite result, and whether all required documentation files (`AGENTS.md`, `docs/architecture.md`) are present.
