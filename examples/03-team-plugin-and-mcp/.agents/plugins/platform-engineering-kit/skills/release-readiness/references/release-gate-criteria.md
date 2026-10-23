# Production Release Gate Criteria

Every production release must satisfy all four gates:

1. **Automated Test Gate:** All unit and integration tests pass with zero flaky retries.
2. **Database Migration Gate:** Any SQL migration is backward-compatible with the currently running N-1 application version.
3. **Observability Gate:** Structured JSON logs and health endpoints are verified in staging.
4. **Rollback Gate:** A tested 1-command rollback procedure is documented in the release notes.
