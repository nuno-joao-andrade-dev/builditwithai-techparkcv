"""Versioned HTTP route handlers for apps/api."""

from typing import Any


def list_users(request_id: str) -> dict[str, Any]:
    """Handle GET /v1/users and return the standardized response envelope."""
    users = [
        {
            "id": "usr_01",
            "email": "ada@example.com",
            "displayName": "Ada Lovelace",
        }
    ]
    return {
        "data": users,
        "meta": {
            "requestId": request_id,
            "count": len(users),
        },
    }
