# Platform Engineering Kit Plugin

This plugin packages our SRE and Platform Engineering customizations into a single unit:

- **Rules (`rules/AGENTS.md`):** Enforces observability, structured logging, and incident response communication standards.
- **Skills (`skills/`):**
  - `incident-triage`: Automated diagnostic collection and severity classification.
  - `release-readiness`: Pre-release verification checklist.
- **Hooks (`hooks.json`):** Injects a session-start reminder when the plugin is active.
- **MCP Servers (`mcp_config.json`):** Connects the agent to the local Service Registry MCP server (`platform-engineering-kit-registry`).
