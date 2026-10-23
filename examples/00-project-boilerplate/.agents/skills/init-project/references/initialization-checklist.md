# AI-First Project Initialization Checklist

Verify every item below before considering project initialization complete:

- [ ] **`AGENTS.md` Customized:** Under 100 lines, zero `[TODO: ...]` placeholders, and includes exact commands for installing dependencies, running tests, and linting.
- [ ] **`docs/product-spec.md` Populated:** Problem statement, MVP user stories with acceptance criteria, explicit non-goals, and domain glossary are defined.
- [ ] **`docs/architecture.md` Populated:** Module boundaries (`src/` vs `tests/`), data flow, and domain invariants are documented.
- [ ] **`docs/adr/0001-initial-architecture-and-stack.md` Updated:** Records the chosen language, runtime, and testing framework.
- [ ] **Safety Hooks Active:** `.agents/hooks.json` and `.agents/scripts/pre-tool-safety.sh` are present and executable (`chmod +x`).
- [ ] **Baseline Code & Tests Passing:** `src/` contains the initial module, `tests/` contains the initial test suite, and the test command in `AGENTS.md` exits with status `0`.
