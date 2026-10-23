#!/usr/bin/env bash
# PreToolUse Hook: Inspects run_command arguments on stdin and blocks destructive commands.
set -euo pipefail

PAYLOAD="$(cat)"

CMD_LINE="$(node -e '
let raw = "";
process.stdin.on("data", c => raw += c);
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(raw);
    console.log(data?.toolCall?.args?.CommandLine || "");
  } catch {
    console.log("");
  }
});
' <<< "$PAYLOAD")"

if [[ "$CMD_LINE" =~ rm[[:space:]]+-rf[[:space:]]+(/|\.|~) ]] || [[ "$CMD_LINE" =~ git[[:space:]]+reset[[:space:]]+--hard ]]; then
  printf '{"decision":"deny","reason":"Blocked by restaurant workspace safety hook: destructive rm -rf or git reset --hard is prohibited."}\n'
  exit 0
fi

printf '{"decision":"allow"}\n'
