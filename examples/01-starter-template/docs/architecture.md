# System Architecture

## High-Level Design
This project follows a **Modular Monolith** architecture with strict separation between pure domain logic and I/O adapters.

```text
+---------------------------------------------------+
|                   Entrypoints / CLI               |
+---------------------------------------------------+
                         |
                         v
+---------------------------------------------------+
|              Pure Domain Logic (src/)             |
|  - Order & LineItem models                        |
|  - Tax & Subtotal calculation rules               |
+---------------------------------------------------+
```

## Module Responsibilities
- `src/main.py`: Core domain models and pure calculation functions. Must remain deterministic and free of network or filesystem side effects.
- `tests/test_main.py`: Fast unit test suite verifying domain invariants and edge cases.
- `docs/adr/`: Architecture Decision Records capturing the context and consequences of major technical choices.

## Change Management Guidelines for AI Agents
1. Whenever adding a new domain capability, start by reading existing models in `src/main.py`.
2. Add or update unit tests in `tests/test_main.py` in the same turn as the implementation.
3. If a change alters architectural boundaries or introduces a new dependency, propose a new ADR in `docs/adr/`.
