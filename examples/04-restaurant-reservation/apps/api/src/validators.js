import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractsPath = path.resolve(__dirname, "../../../packages/shared/contracts.json");
export const CONTRACTS = JSON.parse(fs.readFileSync(contractsPath, "utf8"));

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate query parameters for table availability check.
 */
export function validateAvailabilityQuery({ date, timeSlot, partySize }) {
  const errors = [];

  if (!date || !DATE_REGEX.test(date)) {
    errors.push("date is required and must match YYYY-MM-DD.");
  }
  if (!timeSlot || !CONTRACTS.timeSlots.includes(timeSlot)) {
    errors.push(`timeSlot must be one of: ${CONTRACTS.timeSlots.join(", ")}.`);
  }

  const parsedParty = partySize !== undefined && partySize !== "" ? Number(partySize) : 2;
  if (!Number.isInteger(parsedParty) || parsedParty < 1 || parsedParty > 12) {
    errors.push("partySize must be an integer between 1 and 12.");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      date,
      timeSlot,
      partySize: parsedParty,
    },
  };
}

/**
 * Validate payload for creating a new reservation.
 */
export function validateCreateReservation(payload = {}) {
  const errors = [];
  const guestName = typeof payload.guestName === "string" ? payload.guestName.trim() : "";
  const guestContact = typeof payload.guestContact === "string" ? payload.guestContact.trim() : "";
  const tableId = typeof payload.tableId === "string" ? payload.tableId.trim() : "";
  const date = typeof payload.date === "string" ? payload.date.trim() : "";
  const timeSlot = typeof payload.timeSlot === "string" ? payload.timeSlot.trim() : "";
  const partySize = Number(payload.partySize);
  const specialRequests =
    typeof payload.specialRequests === "string" ? payload.specialRequests.trim() : "";

  if (guestName.length < 2) {
    errors.push("guestName must be at least 2 characters long.");
  }
  if (guestContact.length < 5) {
    errors.push("guestContact (email or phone) must be at least 5 characters long.");
  }
  if (!tableId) {
    errors.push("tableId is required.");
  }
  if (!DATE_REGEX.test(date)) {
    errors.push("date must match YYYY-MM-DD.");
  }
  if (!CONTRACTS.timeSlots.includes(timeSlot)) {
    errors.push(`timeSlot must be one of: ${CONTRACTS.timeSlots.join(", ")}.`);
  }
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
    errors.push("partySize must be an integer between 1 and 12.");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      guestName,
      guestContact,
      tableId,
      date,
      timeSlot,
      partySize,
      specialRequests,
    },
  };
}

/**
 * Validate payload for updating reservation status.
 */
export function validateStatusUpdate(payload = {}) {
  const status = typeof payload.status === "string" ? payload.status.trim() : "";
  if (!CONTRACTS.reservationStatuses.includes(status)) {
    return {
      valid: false,
      errors: [`status must be one of: ${CONTRACTS.reservationStatuses.join(", ")}.`],
      value: null,
    };
  }
  return { valid: true, errors: [], value: { status } };
}
