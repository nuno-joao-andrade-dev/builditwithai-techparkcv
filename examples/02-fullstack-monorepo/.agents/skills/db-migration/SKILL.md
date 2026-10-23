---
name: db-migration
description: >-
  Creates and validates zero-downtime SQL database migrations under apps/api/migrations/.
  Use this skill whenever the user asks to create, alter, or review database tables, columns, or indexes.
---

# Zero-Downtime Database Migration Skill

Follow these exact steps when creating or modifying SQL migrations:

## Step 1: Inspect Existing Migrations & Reference Example
1. Check existing files in `apps/api/migrations/` to determine the next sequential number (`NNN_...`).
2. Review the canonical migration structure in [001_create_users.sql](./examples/001_create_users.sql).

## Step 2: Check Zero-Downtime Rules
Before adding `ALTER TABLE`, `DROP COLUMN`, or `CREATE INDEX` statements, read:
- [zero-downtime-migrations.md](./references/zero-downtime-migrations.md)

## Step 3: Validate the Migration File
Run the validation script against the new SQL file and fix any reported issues before finishing:
```bash
./.agents/skills/db-migration/scripts/validate-sql.sh apps/api/migrations/<new_migration>.sql
```
