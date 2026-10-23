# Incident Severity Classification Matrix

| Severity | Definition | Target Response SLA |
| :--- | :--- | :--- |
| **SEV-1** | Complete outage or data integrity risk affecting > 20% of users. | Immediate (< 15 min) |
| **SEV-2** | Partial service degradation, elevated error rate (> 1%), or p95 latency > 500ms on core flows. | < 30 min |
| **SEV-3** | Minor degradation on non-critical background workers with automatic retries succeeding. | < 4 hours |
| **SEV-4** | Cosmetic issue or operational warning with zero customer impact. | Next business day |
