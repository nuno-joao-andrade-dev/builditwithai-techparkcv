#!/usr/bin/env bash
# PreToolUse Hook: Deterministically blocks destructive shell or database commands.
set -euo pipefail

PAYLOAD="$(cat)"

CMD_LINE="$(python3 -c '
import json, sys
try:
    data = json.loads(sys.stdin.read())
    cmd = (
        data.get("tool_input", {}).get("command")
        or data.get("tool_input", {}).get("CommandLine")
        or data.get("toolCall", {}).get("args", {}).get("CommandLine")
        or ""
    )
    print(cmd)
except Exception:
    print("")
' <<< "$PAYLOAD")"

if [[ "$CMD_LINE" =~ rm[[:space:]]+-rf[[:space:]]+(/|\.|~) ]] || \
   [[ "$CMD_LINE" =~ git[[:space:]]+reset[[:space:]]+--hard ]] || \
   [[ "${CMD_LINE^^}" =~ DROP[[:space:]]+(DATABASE|TABLE) ]]; then
  printf '{"decision":"deny","reason":"Blocked by boilerplate safety hook: destructive rm -rf, git reset --hard, or DROP DATABASE/TABLE commands are not permitted."}\n'
  exit 0
fi

exit 0
