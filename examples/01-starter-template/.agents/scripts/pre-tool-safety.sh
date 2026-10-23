#!/usr/bin/env bash
# PreToolUse Hook: Inspects run_command arguments on stdin and blocks destructive commands.
set -euo pipefail

PAYLOAD="$(cat)"

# Extract CommandLine using python3 to avoid external jq dependency
CMD_LINE="$(python3 -c '
import json, sys
try:
    data = json.loads(sys.stdin.read())
    print(data.get("toolCall", {}).get("args", {}).get("CommandLine", ""))
except Exception:
    print("")
' <<< "$PAYLOAD")"

# Block destructive patterns
if [[ "$CMD_LINE" =~ rm[[:space:]]+-rf[[:space:]]+(/|\.|~) ]] || [[ "$CMD_LINE" =~ git[[:space:]]+reset[[:space:]]+--hard ]]; then
  printf '{"decision":"deny","reason":"Blocked by workspace safety hook: destructive rm -rf or git reset --hard is not permitted."}\n'
  exit 0
fi

printf '{"decision":"allow"}\n'
