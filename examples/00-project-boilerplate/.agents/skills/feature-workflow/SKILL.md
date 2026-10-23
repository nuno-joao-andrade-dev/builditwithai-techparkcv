---
name: feature-workflow
description: >-
  Standard spec-first workflow for adding or modifying features in this project.
  Use this skill whenever implementing a new user story, endpoint, CLI command, or domain module.
---

# Spec-First Feature Implementation Skill (`feature-workflow`)

Follow these 4 steps whenever implementing a new feature or modifying existing behavior:

## Step 1: Align with Product Spec & Architecture
1. Read [`docs/product-spec.md`](../../../docs/product-spec.md) and [`docs/architecture.md`](../../../docs/architecture.md).
2. Confirm how the requested feature fits into the existing module boundaries and domain glossary.
3. If the feature introduces a new user story or changes an architectural boundary, update `docs/product-spec.md` or `docs/architecture.md` first.

## Step 2: Implement Domain Logic & Validation in `src/`
1. Follow the coding standards in [`docs/conventions.md`](../../../docs/conventions.md).
2. Keep business rules pure and separate from HTTP/CLI transport concerns.
3. Validate inputs at system boundaries and return clear, structured errors.

## Step 3: Write Automated Tests in `tests/`
1. Add unit or integration tests in `tests/` covering:
   - The happy path (expected output for valid input).
   - Edge cases and invalid input rejection.

## Step 4: Run the Verification Gate
1. Execute the canonical test and lint commands listed in [`AGENTS.md`](../../../AGENTS.md).
2. Fix any failures before reporting completion to the user.
