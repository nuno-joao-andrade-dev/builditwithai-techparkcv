import { CONTRACTS } from "./validators.js";

export const INITIAL_TABLES = [
  { id: "T1", name: "Table 1 — Window Two-Top", capacity: 2, zone: "window" },
  { id: "T2", name: "Table 2 — Window Two-Top", capacity: 2, zone: "window" },
  { id: "T3", name: "Table 3 — Main Dining Four-Top", capacity: 4, zone: "main-dining" },
  { id: "T4", name: "Table 4 — Main Dining Four-Top", capacity: 4, zone: "main-dining" },
  { id: "T5", name: "Table 5 — Garden Patio Six-Top", capacity: 6, zone: "patio" },
  { id: "T6", name: "Table 6 — Chef's Private Room", capacity: 8, zone: "private-room" },
];

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export class DomainError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ReservationStore {
  constructor({ seedDate = getTodayIsoDate(), seedReservations = true } = {}) {
    this.tables = INITIAL_TABLES.map((t) => ({ ...t }));
    this.nextSeq = 1003;
    this.reservations = seedReservations
      ? [
          {
            id: "res_1001",
            tableId: "T3",
            guestName: "Sofia Almeida",
            guestContact: "sofia.almeida@example.com",
            date: seedDate,
            timeSlot: "19:00",
            partySize: 4,
            specialRequests: "Birthday dessert candle at the end of dinner",
            status: "confirmed",
            createdAt: new Date(Date.now() - 3600_000).toISOString(),
          },
          {
            id: "res_1002",
            tableId: "T1",
            guestName: "Marco Silva",
            guestContact: "+351 912 345 678",
            date: seedDate,
            timeSlot: "19:00",
            partySize: 2,
            specialRequests: "Window view requested, gluten-free bread",
            status: "seated",
            createdAt: new Date(Date.now() - 1800_000).toISOString(),
          },
        ]
      : [];
  }

  getMetaConfig() {
    return {
      timeSlots: CONTRACTS.timeSlots,
      zones: CONTRACTS.zones,
      reservationStatuses: CONTRACTS.reservationStatuses,
    };
  }

  listTables({ zone, minCapacity } = {}) {
    return this.tables.filter((table) => {
      if (zone && table.zone !== zone) {
        return false;
      }
      if (minCapacity !== undefined && minCapacity !== "") {
        const minCap = Number(minCapacity);
        if (!Number.isNaN(minCap) && table.capacity < minCap) {
          return false;
        }
      }
      return true;
    });
  }

  getTableById(tableId) {
    return this.tables.find((t) => t.id === tableId) || null;
  }

  isSlotBooked(tableId, date, timeSlot) {
    return this.reservations.some(
      (res) =>
        res.tableId === tableId &&
        res.date === date &&
        res.timeSlot === timeSlot &&
        (res.status === "confirmed" || res.status === "seated")
    );
  }

  getAvailability({ date, timeSlot, partySize }) {
    const evaluatedTables = this.tables.map((table) => {
      const booked = this.isSlotBooked(table.id, date, timeSlot);
      const fitsParty = table.capacity >= partySize;
      const available = !booked && fitsParty;

      let reason = null;
      if (booked) {
        reason = "BOOKED";
      } else if (!fitsParty) {
        reason = "INSUFFICIENT_CAPACITY";
      }

      return {
        ...table,
        booked,
        fitsParty,
        available,
        reason,
      };
    });

    return {
      date,
      timeSlot,
      partySize,
      availableCount: evaluatedTables.filter((t) => t.available).length,
      tables: evaluatedTables,
    };
  }

  listReservations({ date, status } = {}) {
    return this.reservations
      .filter((res) => {
        if (date && res.date !== date) {
          return false;
        }
        if (status && res.status !== status) {
          return false;
        }
        return true;
      })
      .map((res) => {
        const table = this.getTableById(res.tableId);
        return {
          ...res,
          tableName: table ? table.name : res.tableId,
          tableZone: table ? table.zone : "unknown",
          tableCapacity: table ? table.capacity : 0,
        };
      })
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot) || a.id.localeCompare(b.id));
  }

  createReservation({
    tableId,
    guestName,
    guestContact,
    date,
    timeSlot,
    partySize,
    specialRequests = "",
  }) {
    const table = this.getTableById(tableId);
    if (!table) {
      throw new DomainError(
        "TABLE_NOT_FOUND",
        `Table '${tableId}' does not exist.`,
        404
      );
    }

    if (partySize > table.capacity) {
      throw new DomainError(
        "CAPACITY_EXCEEDED",
        `Party size (${partySize}) exceeds capacity of ${table.name} (max ${table.capacity} guests).`,
        400
      );
    }

    if (this.isSlotBooked(tableId, date, timeSlot)) {
      throw new DomainError(
        "TABLE_ALREADY_BOOKED",
        `${table.name} is already booked on ${date} at ${timeSlot}.`,
        409
      );
    }

    const reservation = {
      id: `res_${this.nextSeq++}`,
      tableId,
      guestName,
      guestContact,
      date,
      timeSlot,
      partySize,
      specialRequests,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    this.reservations.push(reservation);

    return {
      ...reservation,
      tableName: table.name,
      tableZone: table.zone,
      tableCapacity: table.capacity,
    };
  }

  updateReservationStatus(reservationId, newStatus) {
    const reservation = this.reservations.find((r) => r.id === reservationId);
    if (!reservation) {
      throw new DomainError(
        "RESERVATION_NOT_FOUND",
        `Reservation '${reservationId}' was not found.`,
        404
      );
    }

    // If re-activating a cancelled reservation, ensure no double-booking conflict exists
    if (
      reservation.status === "cancelled" &&
      (newStatus === "confirmed" || newStatus === "seated") &&
      this.isSlotBooked(reservation.tableId, reservation.date, reservation.timeSlot)
    ) {
      throw new DomainError(
        "TABLE_ALREADY_BOOKED",
        `Cannot reactivate reservation because table ${reservation.tableId} is now booked at ${reservation.timeSlot}.`,
        409
      );
    }

    reservation.status = newStatus;
    const table = this.getTableById(reservation.tableId);
    return {
      ...reservation,
      tableName: table ? table.name : reservation.tableId,
      tableZone: table ? table.zone : "unknown",
      tableCapacity: table ? table.capacity : 0,
    };
  }
}
