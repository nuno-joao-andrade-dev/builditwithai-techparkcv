---
name: security-audit
description: >-
  Audits source files and configurations for hardcoded secrets, insecure subprocess calls,
  and missing input validation. Use this skill when the user asks for a security review or audit.
---

# Security Audit Skill (Shared via `.agents/skills.json`)

When performing a security audit:
1. Scan for hardcoded credentials, tokens, or private keys.
2. Check that shell scripts use `set -euo pipefail` and quote variables properly.
3. Verify that MCP servers in `mcp_config.json` follow the principle of least privilege (e.g., `DB_READONLY: "true"`).
