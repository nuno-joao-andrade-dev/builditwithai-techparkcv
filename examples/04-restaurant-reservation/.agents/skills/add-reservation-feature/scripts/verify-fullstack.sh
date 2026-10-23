#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

cd "$PROJECT_ROOT"

echo "==> [1/3] Checking JavaScript syntax in apps/api..."
for f in apps/api/src/*.js apps/api/tests/*.js; do
  node --check "$f"
done

echo "==> [2/3] Running Node.js API test suite..."
npm --prefix apps/api test

echo "==> [3/3] Verifying React frontend production build..."
npm --prefix apps/web run build

echo "✅ Full-stack verification succeeded!"
