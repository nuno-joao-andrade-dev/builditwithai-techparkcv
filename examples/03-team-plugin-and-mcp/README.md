# 03 — Team Plugin, MCP Server & Declarative JSON Configs

This example demonstrates **advanced team-scale customizations** in Google Antigravity (`agy`):
1. **Declarative JSON Configurations (`.agents/skills.json` & `.agents/plugins.json`):**
   - Registering skills stored in custom shared directories (`tools/shared-skills/`) and filtering patterns with `exclude` regexes.
2. **Full Plugin Bundle (`.agents/plugins/platform-engineering-kit/`):**
   - Packaging **Skills** (`incident-triage`, `release-readiness`), **Rules** (`rules/AGENTS.md`), **Hooks** (`hooks.json`), **Logo** (`assets/logo.svg`), and **MCP Server Configs** (`mcp_config.json`) into a single shareable unit.
3. **Model Context Protocol (`mcp_config.json` & `tools/local-mcp-server/server.py`):**
   - Includes a working zero-dependency Python **MCP Stdio** JSON-RPC server (`tools/local-mcp-server/server.py`) that exposes `list_registered_services` and `get_service_metadata` tools to the agent.

---

## 1. Directory Structure

```text
03-team-plugin-and-mcp/
├── README.md                                            # This step-by-step guide
├── AGENTS.md                                            # Workspace-level rules
├── .agents/
│   ├── skills.json                                      # Registers tools/shared-skills (excludes experimental-.*)
│   ├── plugins.json                                     # Registers .agents/plugins
│   └── plugins/
│       └── platform-engineering-kit/
│           ├── plugin.json                              # Plugin manifest (JSONC)
│           ├── README.md                                # Human-facing docs (ignored by agent runtime)
│           ├── mcp_config.json                          # Spawns ../../../tools/local-mcp-server/server.py
│           ├── hooks.json                               # SessionStart hook injecting SRE banner
│           ├── assets/logo.svg                          # Square SVG icon
│           ├── rules/AGENTS.md                          # Consolidated plugin rules (blameless reports, JSON logs)
│           └── skills/
│               ├── incident-triage/
│               │   ├── SKILL.md
│               │   ├── scripts/collect-diagnostics.sh   # Outputs structured JSON telemetry for services
│               │   └── references/severity-matrix.md    # SEV-1 to SEV-4 definitions and SLAs
│               └── release-readiness/
│                   ├── SKILL.md
│                   └── references/release-gate-criteria.md
└── tools/
    ├── shared-skills/
    │   └── security-audit/
    │       └── SKILL.md                                 # Loaded via .agents/skills.json
    └── local-mcp-server/
        └── server.py                                    # Working MCP Stdio server in pure Python
```

---

## 2. Step-by-Step Instructions & What to Expect

Follow the exercises below to test the MCP server, the `platform-engineering-kit` plugin, and the shared skills.

---

### Exercise 1: Test the Local MCP Stdio Server Directly in the Terminal

Before launching `agy`, let's verify the JSON-RPC 2.0 MCP server (`tools/local-mcp-server/server.py`) directly over `stdin`/`stdout`.

#### Instructions
1. Open your terminal and navigate to this example directory:
   ```bash
   cd examples/03-team-plugin-and-mcp
   ```
2. Send an MCP `tools/list` request to discover the tools exposed by the server:
   ```bash
   printf '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n' \
     | python3 tools/local-mcp-server/server.py | python3 -m json.tool
   ```
3. Send an MCP `tools/call` request invoking `list_registered_services` with `REGISTRY_ENV=staging`:
   ```bash
   printf '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_registered_services","arguments":{}}}\n' \
     | REGISTRY_ENV=staging python3 tools/local-mcp-server/server.py | python3 -m json.tool
   ```

#### What to Expect
- **Step 2 (`tools/list`)** returns the JSON-RPC schema for two MCP tools:
  1. `list_registered_services`: Lists all internal services registered in the platform catalog.
  2. `get_service_metadata`: Fetches `owner`, `tier`, `status`, and `version` for a specific `service_name`.
- **Step 3 (`tools/call` -> `list_registered_services`)** returns the catalog payload:
  ```json
  {
    "environment": "staging",
    "services": {
      "checkout-api": {
        "owner": "payments-team",
        "tier": "tier-1",
        "status": "healthy",
        "version": "2.14.0"
      },
      "inventory-worker": {
        "owner": "supply-chain-team",
        "tier": "tier-2",
        "status": "degraded",
        "version": "1.8.3"
      }
    }
  }
  ```

---

### Exercise 2: Launch `agy` and Observe Startup Discovery (Plugin + MCP + Hook)

Now let's launch `agy` and see what gets loaded automatically when the session starts.

#### Instructions
1. From `examples/03-team-plugin-and-mcp`, launch `agy`:
   ```bash
   agy
   ```
2. Ask the agent what plugins, MCP servers, and skills are available in this workspace:
   ```text
   List the active MCP tools and skills available in this workspace and query the service registry using the MCP server.
   ```

#### What to Expect
When `agy` starts in this directory, four customization mechanisms activate simultaneously:
1. **Plugin Discovery (`.agents/plugins.json`):**
   - Loads `.agents/plugins/platform-engineering-kit/plugin.json`.
   - Applies `.agents/plugins/platform-engineering-kit/rules/AGENTS.md` (requiring blameless incident reports and structured JSON telemetry).
2. **`SessionStart` Lifecycle Hook (`.agents/plugins/platform-engineering-kit/hooks.json`):**
   - Runs at session startup and injects the system message:
     > `"Platform Engineering Kit plugin is active. Use incident-triage and release-readiness skills for operational workflows."`
3. **MCP Server Connection (`.agents/plugins/platform-engineering-kit/mcp_config.json`):**
   - `agy` resolves `../../../tools/local-mcp-server/server.py` relative to the plugin directory, completes the JSON-RPC `initialize` handshake, and registers `list_registered_services` and `get_service_metadata` as live tools.
4. **Shared Skill Discovery (`.agents/skills.json`):**
   - Registers `tools/shared-skills/security-audit/SKILL.md` alongside the plugin's `incident-triage` and `release-readiness` skills.
5. **Agent Action:**
   - The agent invokes the MCP tool `list_registered_services` and reports back that `checkout-api` (`v2.14.0`, `payments-team`, `tier-1`) is **healthy** while `inventory-worker` (`v1.8.3`, `supply-chain-team`, `tier-2`) is **degraded** in the `staging` environment.

---

### Exercise 3: Run Full Incident Triage (`incident-triage` Skill + MCP Server)

Let's combine the MCP Service Registry with the `incident-triage` skill to diagnose the degraded service.

#### Instructions
Inside your running `agy` session, enter:

```text
Run an incident triage for our services, check the metadata of any degraded service via MCP, and generate a triage report.
```

#### What to Expect
Watch the step-by-step workflow the agent executes:

1. **Activates `incident-triage` Skill:**
   - Reads `.agents/plugins/platform-engineering-kit/skills/incident-triage/SKILL.md`.
2. **Step 1 — Runs Diagnostic Script (`collect-diagnostics.sh`):**
   - Executes `./.agents/plugins/platform-engineering-kit/skills/incident-triage/scripts/collect-diagnostics.sh`, which outputs two structured JSON log lines:
     ```json
     {"timestamp":"2026-10-21T17:45:00Z","level":"INFO","service":"checkout-api","traceId":"trc_9941","status":"healthy","p95LatencyMs":42,"errorRatePct":0.02}
     {"timestamp":"2026-10-21T17:45:01Z","level":"WARN","service":"inventory-worker","traceId":"trc_9942","status":"degraded","p95LatencyMs":890,"errorRatePct":2.40,"message":"Database connection pool saturation at 92%"}
     ```
3. **Queries MCP Tool (`get_service_metadata`):**
   - Calls `get_service_metadata(service_name="inventory-worker")` to identify the owning team (`supply-chain-team`), service tier (`tier-2`), and version (`1.8.3`).
4. **Step 2 — Classifies Severity via `severity-matrix.md`:**
   - Reads `.agents/plugins/platform-engineering-kit/skills/incident-triage/references/severity-matrix.md`.
   - Because `inventory-worker` has `errorRatePct: 2.40%` (`> 1%`) and `p95LatencyMs: 890ms` (`> 500ms`), the agent deterministically classifies the incident as **SEV-2** (Target Response SLA: `< 30 min`).
5. **Step 3 — Produces a Blameless Triage Summary:**
   - Guided by `rules/AGENTS.md` (*"Blameless Incident Reports: Never attribute incidents to individual engineers; focus on system mechanisms, blast radius, and automated guardrails"*), the agent outputs a structured report with:
     - **Severity & Impact:** `SEV-2` on `inventory-worker` (`v1.8.3`, owned by `supply-chain-team`).
     - **Diagnostic Findings:** Trace ID `trc_9942`, `p95LatencyMs = 890ms`, `errorRatePct = 2.40%`, root cause: database connection pool saturation at 92%.
     - **Immediate Next Action:** Mitigate connection pool exhaustion (scale pool limits or roll back `inventory-worker` `v1.8.3`).

---

### Exercise 4: Run a Production Release Gate (`release-readiness`) & Security Audit (`security-audit`)

Finally, let's test the second plugin skill (`release-readiness`) and the shared repository skill (`security-audit` loaded via `.agents/skills.json`).

#### Instructions
Inside your `agy` session, try either (or both) of these prompts:

```text
Evaluate whether inventory-worker is ready for production deployment using our release-readiness skill.
```

```text
Run a security audit on this repository using our security-audit skill.
```

#### What to Expect
1. **For the `release-readiness` prompt:**
   - The agent reads `.agents/plugins/platform-engineering-kit/skills/release-readiness/references/release-gate-criteria.md`.
   - It evaluates each mandatory gate (Zero-Downtime Migrations, Observability, Rollback Plan, Error Budget `p95 latency` & `error rate < 0.5%`).
   - It outputs a **Release Gate Scorecard** marking `inventory-worker` as **`BLOCKED`** because its current `errorRatePct` (`2.40%`) exceeds the `< 0.5%` error budget gate and its `p95LatencyMs` (`890ms`) is degraded.
2. **For the `security-audit` prompt:**
   - The agent activates `tools/shared-skills/security-audit/SKILL.md` (discovered through `.agents/skills.json`).
   - It scans the repository for hardcoded credentials, verifies that `.sh` scripts use `set -euo pipefail`, and checks `.agents/plugins/platform-engineering-kit/mcp_config.json` environment variables (`REGISTRY_ENV: "staging"`).
