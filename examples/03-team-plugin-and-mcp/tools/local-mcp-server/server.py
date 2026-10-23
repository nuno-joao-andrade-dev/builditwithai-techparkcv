#!/usr/bin/env python3
"""Minimal educational Model Context Protocol (MCP) Stdio JSON-RPC server.

Supports `initialize`, `tools/list`, and `tools/call` over standard input/output
using zero external dependencies.
"""

import json
import os
import sys
from typing import Any

SERVICES = {
    "checkout-api": {
        "owner": "payments-team",
        "tier": "tier-1",
        "status": "healthy",
        "version": "2.14.0",
    },
    "inventory-worker": {
        "owner": "supply-chain-team",
        "tier": "tier-2",
        "status": "degraded",
        "version": "1.8.3",
    },
}


def handle_request(req: dict[str, Any]) -> dict[str, Any] | None:
    method = req.get("method")
    req_id = req.get("id")

    if method == "initialize":
        client_version = req.get("params", {}).get("protocolVersion") or "2025-03-26"
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": client_version,
                "capabilities": {"tools": {}},
                "serverInfo": {
                    "name": "platform-engineering-kit-registry",
                    "version": "1.0.0",
                },
            },
        }

    if method == "ping":
        return {"jsonrpc": "2.0", "id": req_id, "result": {}}

    if method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": [
                    {
                        "name": "list_registered_services",
                        "description": "List all internal services registered in the platform catalog.",
                        "inputSchema": {
                            "type": "object",
                            "properties": {},
                        },
                    },
                    {
                        "name": "get_service_metadata",
                        "description": "Fetch owner, tier, status, and version for a specific service.",
                        "inputSchema": {
                            "type": "object",
                            "required": ["service_name"],
                            "properties": {
                                "service_name": {
                                    "type": "string",
                                    "description": "Name of the service (e.g., checkout-api)",
                                }
                            },
                        },
                    },
                ]
            },
        }

    if method == "tools/call":
        params = req.get("params", {})
        tool_name = params.get("name")
        args = params.get("arguments", {})
        env_name = os.environ.get("REGISTRY_ENV", "local")

        if tool_name == "list_registered_services":
            payload = {"environment": env_name, "services": SERVICES}
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": json.dumps(payload, indent=2)}]
                },
            }

        if tool_name == "get_service_metadata":
            svc_name = args.get("service_name", "")
            svc = SERVICES.get(svc_name)
            if not svc:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "isError": True,
                        "content": [
                            {"type": "text", "text": f"Service '{svc_name}' not found."}
                        ],
                    },
                }
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": json.dumps(svc, indent=2)}]
                },
            }

    if req_id is not None:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"},
        }
    return None


def main() -> None:
    for raw_line in sys.stdin:
        line = raw_line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
            response = handle_request(request)
            if response is not None:
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()
        except Exception as exc:
            err = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {"code": -32700, "message": str(exc)},
            }
            sys.stdout.write(json.dumps(err) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
