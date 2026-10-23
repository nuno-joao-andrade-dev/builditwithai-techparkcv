import http from "node:http";
import { createRequestListener } from "./app.js";
import { ReservationStore } from "./store.js";

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";

const store = new ReservationStore();
const server = http.createServer(createRequestListener(store));

server.listen(PORT, HOST, () => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      service: "bistronode-reservation-api",
      message: `Restaurant Reservation API listening on http://localhost:${PORT}`,
      endpoints: [
        "GET    /api/v1/health",
        "GET    /api/v1/tables",
        "GET    /api/v1/tables/availability?date=YYYY-MM-DD&timeSlot=HH:MM&partySize=N",
        "GET    /api/v1/reservations?date=YYYY-MM-DD",
        "POST   /api/v1/reservations",
        "PATCH  /api/v1/reservations/:id/status",
        "DELETE /api/v1/reservations/:id",
      ],
    })
  );
});
