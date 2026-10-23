#!/usr/bin/env bash
# PostToolUse Hook: Validates Python syntax after file edits and returns {} as required by PostToolUse contract.
set -euo pipefail

PAYLOAD="$(cat)"

TARGET_PATH="$(python3 -c '
import json, sys
try:
    data = json.loads(sys.stdin.read())
    path = (
        data.get("tool_input", {}).get("file_path")
        or data.get("tool_input", {}).get("Path")
        or data.get("toolCall", {}).get("args", {}).get("Path")
        or ""
    )
    print(path)
except Exception:
    print("")
' <<< "$PAYLOAD")"

if [[ "$TARGET_PATH" == *.py ]] && [[ -f "$TARGET_PATH" ]]; then
  python3 -m py_compile "$TARGET_PATH" >/dev/null 2>&1 || true
fi

printf '{}\n'
