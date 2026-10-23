#!/usr/bin/env bash
set -euo pipefail

echo '{"timestamp":"2026-10-21T17:45:00Z","level":"INFO","service":"checkout-api","traceId":"trc_9941","status":"healthy","p95LatencyMs":42,"errorRatePct":0.02}'
echo '{"timestamp":"2026-10-21T17:45:01Z","level":"WARN","service":"inventory-worker","traceId":"trc_9942","status":"degraded","p95LatencyMs":890,"errorRatePct":2.40,"message":"Database connection pool saturation at 92%"}'
