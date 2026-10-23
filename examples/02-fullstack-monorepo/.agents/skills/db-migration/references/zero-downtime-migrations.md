# Zero-Downtime SQL Migration Reference

When evolving a live production database, migrations run while the previous version of `apps/api` is still serving traffic.

## Required Practices
1. **Header Comment:** Every file must begin with `-- Migration: NNN_name` and `-- Description: ...`.
2. **Idempotent Statements:** Always use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX CONCURRENTLY IF NOT EXISTS`.
3. **Adding Columns:** New columns on existing tables must either be `NULL`-able or have a constant `DEFAULT` that does not rewrite the table in PostgreSQL 11+.
4. **Dropping Columns (Expand & Contract):**
   - Release 1: Stop reading/writing the column in `apps/api`.
   - Release 2: Drop the column in a subsequent migration after verifying zero queries reference it.
