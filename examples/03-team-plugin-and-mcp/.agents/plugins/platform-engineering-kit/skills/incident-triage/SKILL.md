---
name: incident-triage
description: >-
  Collects runtime diagnostics, classifies incident severity (SEV-1 to SEV-4),
  and generates a structured triage summary. Use this skill when the user reports
  an outage, latency spike, error rate alert, or asks to run incident triage.
---

# Incident Triage Skill

Follow these steps to triage a service incident systematically:

## Step 1: Collect Environment & Service Diagnostics
Run the bundled diagnostic script:
- Script: [collect-diagnostics.sh](./scripts/collect-diagnostics.sh)
- Command: `./.agents/plugins/platform-engineering-kit/skills/incident-triage/scripts/collect-diagnostics.sh`

## Step 2: Classify Incident Severity
Read the severity definitions in [severity-matrix.md](./references/severity-matrix.md) and assign `SEV-1`, `SEV-2`, `SEV-3`, or `SEV-4`.

## Step 3: Draft the Triage Report
Produce a structured summary containing:
- **Severity & Impact:** Affected service and user-facing symptoms
- **Diagnostic Findings:** Output from the diagnostic check
- **Immediate Next Action:** Mitigation or rollback recommendation
