# Platform Engineering Kit Rules

These rules are active whenever the `platform-engineering-kit` plugin is enabled:

1. **Structured Logging Only:** All operational scripts and backend services must emit structured JSON logs including `timestamp`, `level`, `service`, and `traceId`.
2. **Blameless Incident Reports:** When summarizing an incident or root cause, focus strictly on system behavior, timeline, contributing factors, and automated remediation steps.
3. **Idempotent Automation:** Every operational script under `scripts/` must be safe to run multiple times without side effects (`set -euo pipefail`).
