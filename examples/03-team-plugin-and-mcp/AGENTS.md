# Workspace Rules — Team Plugin & MCP Repository

## Overview
This repository hosts our service platform alongside the shared `platform-engineering-kit` plugin and custom skills registered via `.agents/skills.json`.

## Guidelines
- Use the `incident-triage` skill whenever investigating service degradation or runtime alerts.
- Use the `release-readiness` skill before creating a release tag or production deployment.
- Use the `security-audit` skill (loaded from `tools/shared-skills/`) when reviewing authentication, secrets handling, or external dependencies.
