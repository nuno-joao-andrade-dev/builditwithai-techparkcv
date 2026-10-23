#!/usr/bin/env bash
# Validates that a SQL migration file follows zero-downtime and idempotency rules.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-sql-file>"
  exit 1
fi

SQL_FILE="$1"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "[ERROR] File not found: $SQL_FILE"
  exit 1
fi

echo "Validating migration: $SQL_FILE"

if ! grep -qi "^-- Migration:" "$SQL_FILE"; then
  echo "[FAIL] Missing required header comment '-- Migration: <name>'"
  exit 1
fi

if grep -Eqi "DROP[[:space:]]+TABLE[[:space:]]+[^I]|TRUNCATE[[:space:]]+TABLE" "$SQL_FILE"; then
  echo "[FAIL] Destructive DROP TABLE or TRUNCATE detected without safety guard."
  exit 1
fi

echo "[PASS] Migration $SQL_FILE passed all static zero-downtime checks."
