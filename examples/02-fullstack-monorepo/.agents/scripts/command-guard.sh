#!/usr/bin/env bash
# PreToolUse Hook: Blocks destructive SQL or shell commands before execution.
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

if [[ "${CMD_LINE^^}" =~ DROP[[:space:]]+(DATABASE|TABLE) ]] || [[ "$CMD_LINE" =~ rm[[:space:]]+-rf[[:space:]]+(/|\.|~) ]]; then
  printf '{"decision":"deny","reason":"Blocked by monorepo safety hook: DROP DATABASE/TABLE and destructive rm -rf commands are prohibited."}\n'
  exit 0
fi

printf '{"decision":"allow"}\n'
