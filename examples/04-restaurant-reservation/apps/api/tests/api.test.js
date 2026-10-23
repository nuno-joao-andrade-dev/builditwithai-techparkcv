import assert from "node:assert/strict";
import http from "node:http";
import { after, before, describe, it } from "node:test";
import { createRequestListener } from "../src/app.js";
import { ReservationStore } from "../src/store.js";

describe("BistroNode Restaurant Table Reservation API", () => {
  let server;
  let baseUrl;
  const testDate = "2026-11-15";

  before(async () => {
    const store = new ReservationStore({ seedDate: testDate, seedReservations: true });
    server = http.createServer(createRequestListener(store));
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it("GET /api/v1/health returns service status and contract configuration", async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.status, "ok");
    assert.equal(body.data.tablesCount, 6);
    assert.ok(Array.isArray(body.data.config.timeSlots));
    assert.ok(body.meta.requestId);
  });

  it("GET /api/v1/tables lists tables and filters by zone and minCapacity", async () => {
    const res = await fetch(`${baseUrl}/api/v1/tables?zone=main-dining&minCapacity=4`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 2);
    assert.ok(body.data.every((t) => t.zone === "main-dining" && t.capacity >= 4));
  });

  it("GET /api/v1/tables/availability marks booked and undersized tables accurately", async () => {
    // At 19:00 on testDate, T1 (2-top) and T3 (4-top) are seeded as booked
    const res = await fetch(
      `${baseUrl}/api/v1/tables/availability?date=${testDate}&timeSlot=19:00&partySize=4`
    );
    assert.equal(res.status, 200);
    const body = await res.json();

    const t1 = body.data.tables.find((t) => t.id === "T1");
    const t2 = body.data.tables.find((t) => t.id === "T2");
    const t3 = body.data.tables.find((t) => t.id === "T3");
    const t4 = body.data.tables.find((t) => t.id === "T4");

    assert.equal(t1.booked, true);
    assert.equal(t1.available, false);
    assert.equal(t2.booked, false);
    assert.equal(t2.fitsParty, false);
    assert.equal(t2.reason, "INSUFFICIENT_CAPACITY");
    assert.equal(t3.booked, true);
    assert.equal(t3.reason, "BOOKED");
    assert.equal(t4.available, true);
  });

  it("POST /api/v1/reservations books an available table and prevents double-booking", async () => {
    const payload = {
      tableId: "T4",
      guestName: "Clara Mendes",
      guestContact: "clara.mendes@example.com",
      date: testDate,
      timeSlot: "19:00",
      partySize: 4,
      specialRequests: "Quiet corner if possible",
    };

    const createRes = await fetch(`${baseUrl}/api/v1/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    assert.equal(createRes.status, 201);
    const createdBody = await createRes.json();
    assert.equal(createdBody.data.tableId, "T4");
    assert.equal(createdBody.data.status, "confirmed");

    // Attempting to book T4 again for the same date and timeSlot must return 409 Conflict
    const duplicateRes = await fetch(`${baseUrl}/api/v1/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    assert.equal(duplicateRes.status, 409);
    const duplicateBody = await duplicateRes.json();
    assert.equal(duplicateBody.error.code, "TABLE_ALREADY_BOOKED");
  });

  it("POST /api/v1/reservations rejects party sizes exceeding table capacity", async () => {
    const res = await fetch(`${baseUrl}/api/v1/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: "T2", // 2-top
        guestName: "Tiago Costa",
        guestContact: "tiago@example.com",
        date: testDate,
        timeSlot: "20:00",
        partySize: 5,
      }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error.code, "CAPACITY_EXCEEDED");
  });

  it("PATCH and DELETE /api/v1/reservations/:id update status and release the table when cancelled", async () => {
    // Cancel res_1001 (which holds T3 at 19:00)
    const cancelRes = await fetch(`${baseUrl}/api/v1/reservations/res_1001`, {
      method: "DELETE",
    });
    assert.equal(cancelRes.status, 200);
    const cancelBody = await cancelRes.json();
    assert.equal(cancelBody.data.status, "cancelled");

    // Verify T3 is now available at 19:00
    const availRes = await fetch(
      `${baseUrl}/api/v1/tables/availability?date=${testDate}&timeSlot=19:00&partySize=4`
    );
    const availBody = await availRes.json();
    const t3 = availBody.data.tables.find((t) => t.id === "T3");
    assert.equal(t3.available, true);
  });
});
