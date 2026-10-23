# Engineering & Coding Conventions (`docs/conventions.md`)

> **Agent Instruction:** Follow these standards whenever creating or modifying code and tests in this repository.

## 1. Code Organization & Naming
- **Clarity over Cleverness:** Prefer small, single-purpose functions and explicit variable names matching the glossary in [`docs/product-spec.md`](./product-spec.md).
- **File Size:** Keep source files focused and modular (ideally under 300 lines per file). Split transport, validation, domain logic, and storage into separate modules.
- **Documentation:** Include a brief module header or docstring on public functions explaining inputs, outputs, and error conditions.

## 2. Testing Standards (`tests/`)
- **Deterministic Tests:** Unit tests must not depend on external network services, wall-clock sleep timers, or execution order.
- **Arrange-Act-Assert (AAA):** Structure every test clearly into setup (Arrange), execution (Act), and verification (Assert).
- **Edge Cases Required:** Always test invalid inputs, empty collections, and boundary conditions alongside the happy path.

## 3. Git & Change Hygiene
- Keep changes scoped to the user's request; do not reformat unrelated files.
- Update [`docs/architecture.md`](./architecture.md) or create a new ADR in [`docs/adr/`](./adr/) whenever an architectural boundary or dependency changes.
