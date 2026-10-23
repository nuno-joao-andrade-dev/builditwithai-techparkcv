#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

echo "=== [1/3] Checking Python runtime ==="
python3 --version

echo "=== [2/3] Checking required AI-Ready files ==="
for file in "AGENTS.md" "docs/architecture.md" ".agents/hooks.json"; do
  if [[ -f "$PROJECT_ROOT/$file" ]]; then
    echo "  [OK] Found $file"
  else
    echo "  [MISSING] $file"
    exit 1
  fi
done

echo "=== [3/3] Running baseline unit tests ==="
cd "$PROJECT_ROOT"
python3 -m unittest discover -s tests -p "test_*.py" -v
echo "=== Workspace verification complete ==="
