# New Feature & Onboarding Checklist

Use this reference when planning a new feature in `01-starter-template`:

1. **Domain First:** Define immutable data structures (`@dataclass(frozen=True)`) in `src/`.
2. **Input Validation:** Reject invalid negative amounts, empty identifiers, or out-of-range rates with `ValueError`.
3. **Fast Unit Tests:** Every public function must have unit tests in `tests/` covering:
   - Happy path calculation
   - Zero / empty boundary case
   - Invalid input raising `ValueError`
4. **Documentation Sync:** Update `docs/architecture.md` if a new file is added under `src/`.
