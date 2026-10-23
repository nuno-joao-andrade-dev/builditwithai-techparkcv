#!/usr/bin/env bash
# PostToolUse Hook: Runs `node --check` on edited .js files and returns {} per PostToolUse contract.
set -euo pipefail

PAYLOAD="$(cat)"

TARGET_PATH="$(node -e '
let raw = "";
process.stdin.on("data", c => raw += c);
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(raw);
    console.log(data?.toolCall?.args?.Path || "");
  } catch {
    console.log("");
  }
});
' <<< "$PAYLOAD")"

if [[ "$TARGET_PATH" == *.js ]] && [[ -f "$TARGET_PATH" ]]; then
  node --check "$TARGET_PATH" >/dev/null 2>&1 || true
fi

printf '{}\n'
