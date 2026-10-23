# API Endpoint Readiness Checklist

- [ ] Route path starts with `/v1/` and uses plural kebab-case resource names.
- [ ] Shared schema in `packages/shared/schemas.json` is updated to match response fields.
- [ ] Successful responses wrap payloads in `{"data": ..., "meta": {"requestId": ...}}`.
- [ ] Error responses follow `docs/conventions.md` (`{"error": {"code": ..., "message": ..., "requestId": ...}}`).
- [ ] All handler arguments and return values have explicit Python type annotations.
