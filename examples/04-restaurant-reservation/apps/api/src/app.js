import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DomainError, ReservationStore } from "./store.js";
import {
  validateAvailabilityQuery,
  validateCreateReservation,
  validateStatusUpdate,
} from "./validators.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDistDir = path.resolve(__dirname, "../../web/dist");

function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Request-Id",
  });
  res.end(payload);
}

function sendSuccess(res, statusCode, data, requestId) {
  sendJson(res, statusCode, {
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  });
}

function sendError(res, statusCode, code, message, requestId, details = undefined) {
  sendJson(res, statusCode, {
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new DomainError("INVALID_JSON", "Request body must be valid JSON.", 400);
  }
}

export function createRequestListener(store = new ReservationStore()) {
  return async (req, res) => {
    const requestId = req.headers["x-request-id"] || `req_${crypto.randomUUID().slice(0, 8)}`;

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Request-Id",
      });
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    try {
      // GET /api/v1/health
      if (req.method === "GET" && pathname === "/api/v1/health") {
        return sendSuccess(
          res,
          200,
          {
            status: "ok",
            service: "bistronode-reservation-api",
            tablesCount: store.tables.length,
            activeReservationsCount: store.reservations.filter(
              (r) => r.status === "confirmed" || r.status === "seated"
            ).length,
            config: store.getMetaConfig(),
          },
          requestId
        );
      }

      // GET /api/v1/tables
      if (req.method === "GET" && pathname === "/api/v1/tables") {
        const zone = url.searchParams.get("zone") || undefined;
        const minCapacity = url.searchParams.get("minCapacity") || undefined;
        const tables = store.listTables({ zone, minCapacity });
        return sendSuccess(res, 200, tables, requestId);
      }

      // GET /api/v1/tables/availability
      if (req.method === "GET" && pathname === "/api/v1/tables/availability") {
        const validation = validateAvailabilityQuery({
          date: url.searchParams.get("date") || "",
          timeSlot: url.searchParams.get("timeSlot") || "",
          partySize: url.searchParams.get("partySize") ?? "2",
        });

        if (!validation.valid) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            validation.errors.join(" "),
            requestId,
            validation.errors
          );
        }

        const availability = store.getAvailability(validation.value);
        return sendSuccess(res, 200, availability, requestId);
      }

      // GET /api/v1/reservations
      if (req.method === "GET" && pathname === "/api/v1/reservations") {
        const date = url.searchParams.get("date") || undefined;
        const status = url.searchParams.get("status") || undefined;
        const reservations = store.listReservations({ date, status });
        return sendSuccess(res, 200, reservations, requestId);
      }

      // POST /api/v1/reservations
      if (req.method === "POST" && pathname === "/api/v1/reservations") {
        const body = await readJsonBody(req);
        const validation = validateCreateReservation(body);
        if (!validation.valid) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            validation.errors.join(" "),
            requestId,
            validation.errors
          );
        }

        const created = store.createReservation(validation.value);
        return sendSuccess(res, 201, created, requestId);
      }

      // PATCH /api/v1/reservations/:id/status
      const statusMatch = pathname.match(/^\/api\/v1\/reservations\/([^/]+)\/status$/);
      if (req.method === "PATCH" && statusMatch) {
        const reservationId = decodeURIComponent(statusMatch[1]);
        const body = await readJsonBody(req);
        const validation = validateStatusUpdate(body);
        if (!validation.valid) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            validation.errors.join(" "),
            requestId,
            validation.errors
          );
        }

        const updated = store.updateReservationStatus(reservationId, validation.value.status);
        return sendSuccess(res, 200, updated, requestId);
      }

      // DELETE /api/v1/reservations/:id
      const deleteMatch = pathname.match(/^\/api\/v1\/reservations\/([^/]+)$/);
      if (req.method === "DELETE" && deleteMatch) {
        const reservationId = decodeURIComponent(deleteMatch[1]);
        const cancelled = store.updateReservationStatus(reservationId, "cancelled");
        return sendSuccess(res, 200, cancelled, requestId);
      }

      // Optional static file serving if apps/web/dist has been built
      if (req.method === "GET" && !pathname.startsWith("/api/") && fs.existsSync(webDistDir)) {
        const targetFile =
          pathname === "/" ? path.join(webDistDir, "index.html") : path.join(webDistDir, pathname);
        const resolved = path.resolve(targetFile);
        if (resolved.startsWith(webDistDir) && fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
          const ext = path.extname(resolved);
          const mimeTypes = {
            ".html": "text/html; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".svg": "image/svg+xml",
            ".json": "application/json; charset=utf-8",
          };
          res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
          res.end(fs.readFileSync(resolved));
          return;
        }
      }

      return sendError(
        res,
        404,
        "ROUTE_NOT_FOUND",
        `Route ${req.method} ${pathname} not found.`,
        requestId
      );
    } catch (err) {
      if (err instanceof DomainError) {
        return sendError(res, err.statusCode, err.code, err.message, requestId);
      }
      return sendError(
        res,
        500,
        "INTERNAL_SERVER_ERROR",
        err instanceof Error ? err.message : "Unexpected server error.",
        requestId
      );
    }
  };
}
