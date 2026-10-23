"""Reference example for a versioned API route handler."""

from typing import Any


def get_health_status(request_id: str) -> dict[str, Any]:
    """Return a standardized /v1/health response envelope."""
    return {
        "data": {
            "status": "ok",
            "version": "v1",
        },
        "meta": {
            "requestId": request_id,
        },
    }
