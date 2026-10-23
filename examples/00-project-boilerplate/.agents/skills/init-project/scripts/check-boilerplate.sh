#!/usr/bin/env bash
# Checks that all required AI-First project boilerplate files exist and reports any remaining [TODO: placeholders.
set -euo pipefail

echo "=== [1/3] Checking required AI-First directories ==="
REQUIRED_DIRS=(
  "docs"
  "docs/adr"
  ".agents"
  ".agents/scripts"
  ".agents/skills/init-project"
  ".agents/skills/feature-workflow"
  "src"
  "tests"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    echo "  [OK] Directory found: $dir/"
  else
    echo "  [MISSING] Directory missing: $dir/"
    exit 1
  fi
done

echo "=== [2/3] Checking required governance & documentation files ==="
REQUIRED_FILES=(
  "AGENTS.md"
  "docs/product-spec.md"
  "docs/architecture.md"
  "docs/conventions.md"
  "docs/adr/0001-initial-architecture-and-stack.md"
  ".agents/hooks.json"
  ".agents/scripts/pre-tool-safety.sh"
  ".agents/mcp.json"
  ".agents/skills/init-project/SKILL.md"
  ".agents/skills/feature-workflow/SKILL.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "  [OK] File found: $file"
  else
    echo "  [MISSING] File missing: $file"
    exit 1
  fi
done

echo "=== [3/3] Checking customization status ([TODO: ...] placeholders) ==="
TODO_COUNT="$(grep -rn "\[TODO:" AGENTS.md docs/ 2>/dev/null | wc -l | tr -d ' ' || true)"

if [[ "$TODO_COUNT" -gt 0 ]]; then
  echo "  [INFO] Template status: UNINITIALIZED BOILERPLATE ($TODO_COUNT '[TODO: ...]' placeholders remaining in AGENTS.md and docs/)."
  echo "  [NEXT] Launch 'agy' and ask: \"Use the init-project skill to initialize this project for <your idea>.\""
else
  echo "  [OK] Template status: INITIALIZED (0 '[TODO: ...]' placeholders remaining!)."
fi

echo "=== Boilerplate structure check PASSED ==="
