# Workspace Rules — Starter Template

## Project Overview
This repository is a clean Python service template structured for AI-assisted development.

## Build, Test & Verification Commands
- **Run all unit tests:** `python3 -m unittest discover -s tests -p "test_*.py" -v`
- **Run a single test file:** `python3 -m unittest tests/test_main.py -v`
- **Syntax / compile check:** `python3 -m py_compile src/main.py tests/test_main.py`

## Coding Standards
- Target **Python 3.11+** using standard library types (`dataclasses`, `typing`).
- Every public function in `src/` must include:
  1. Complete type annotations for parameters and return values.
  2. A concise docstring explaining purpose and edge cases.
  3. Deterministic unit tests in `tests/` covering normal and boundary inputs.
- Prefer pure functions and immutable `dataclass(frozen=True)` structures over mutable global state.
- Raise explicit `ValueError` with descriptive messages when validating domain invariants.

## Architectural Constraints
- Keep `src/` free of external third-party runtime dependencies unless documented in a new ADR under `docs/adr/`.
- Read `docs/architecture.md` before introducing new modules or changing public interfaces.
- Never hardcode secrets, API keys, or environment-specific file paths in source files.
