import React, { useCallback, useEffect, useState } from "react";
import {
  cancelReservation,
  createReservation,
  fetchAvailability,
  fetchHealthAndConfig,
  fetchReservations,
  updateReservationStatus,
} from "./api.js";

const DEFAULT_TIME_SLOTS = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

const ZONE_LABELS = {
  window: "Window View",
  "main-dining": "Main Dining",
  patio: "Garden Patio",
  "private-room": "Private Room",
};

export default function App() {
  const [date, setDate] = useState(getTodayIso());
  const [timeSlot, setTimeSlot] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS);

  const [availability, setAvailability] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successBanner, setSuccessBanner] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const [availData, resList] = await Promise.all([
        fetchAvailability({ date, timeSlot, partySize }),
        fetchReservations({ date }),
      ]);
      setAvailability(availData);
      setReservations(resList);

      // Auto-select the first available table if current selection is unavailable
      const stillValid = availData.tables.find(
        (t) => t.id === selectedTableId && t.available
      );
      if (!stillValid) {
        const firstAvailable = availData.tables.find((t) => t.available);
        setSelectedTableId(firstAvailable ? firstAvailable.id : "");
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Unable to connect to the Reservation API on port 4000."
      );
    } finally {
      setLoading(false);
    }
  }, [date, timeSlot, partySize, selectedTableId]);

  useEffect(() => {
    fetchHealthAndConfig()
      .then((info) => {
        if (info?.config?.timeSlots?.length) {
          setTimeSlots(info.config.timeSlots);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_TIME_SLOTS
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessBanner("");

    if (!selectedTableId) {
      setErrorMessage("Please select an available table before booking.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createReservation({
        tableId: selectedTableId,
        guestName,
        guestContact,
        date,
        timeSlot,
        partySize: Number(partySize),
        specialRequests,
      });

      setGuestName("");
      setGuestContact("");
      setSpecialRequests("");
      setSuccessBanner(
        `Confirmed reservation ${created.id} for ${created.guestName} at ${created.tableName} (${created.timeSlot}).`
      );
      await loadData();
    } catch (err) {
      setErrorMessage(err.message || "Failed to create reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusAction(reservationId, action) {
    setErrorMessage("");
    setSuccessBanner("");
    try {
      if (action === "cancel") {
        await cancelReservation(reservationId);
        setSuccessBanner(`Reservation ${reservationId} has been cancelled.`);
      } else {
        await updateReservationStatus(reservationId, action);
        setSuccessBanner(`Reservation ${reservationId} marked as ${action}.`);
      }
      await loadData();
    } catch (err) {
      setErrorMessage(err.message || "Could not update reservation.");
    }
  }

  const activeReservations = reservations.filter((r) => r.status !== "cancelled");

  return (
    <div className="app-shell">
      <header className="top-header">
        <div>
          <span className="eyebrow">Full-Stack Node.js + React Demo</span>
          <h1>BistroNode Table Reservations</h1>
          <p className="subtitle">
            Real-time floor availability, capacity validation, and double-booking prevention.
          </p>
        </div>
        <div className="stats-pills">
          <div className="stat-pill">
            <span className="stat-label">Available Tables ({timeSlot})</span>
            <strong className="stat-value">
              {availability ? `${availability.availableCount} / ${availability.tables.length}` : "—"}
            </strong>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Active Bookings ({date})</span>
            <strong className="stat-value">{activeReservations.length}</strong>
          </div>
        </div>
      </header>

      <main className="main-container">
        <section className="filter-bar" aria-label="Search Availability Filters">
          <div className="field-group">
            <label htmlFor="filter-date">Reservation Date</label>
            <input
              id="filter-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="filter-slot">Time Slot</label>
            <select
              id="filter-slot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="filter-party">Party Size (Guests)</label>
            <select
              id="filter-party"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="btn-secondary" onClick={loadData}>
            Refresh Availability
          </button>
        </section>

        {errorMessage && (
          <div className="banner banner-error" role="alert">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {successBanner && (
          <div className="banner banner-success" aria-live="polite">
            {successBanner}
          </div>
        )}

        <div className="workspace-grid">
          <section className="card-panel" aria-labelledby="floor-plan-heading">
            <div className="panel-header">
              <h2 id="floor-plan-heading">
                1. Select a Table for {partySize} {partySize === 1 ? "Guest" : "Guests"} at {timeSlot}
              </h2>
              <span className="hint-text">Click an available green card to select</span>
            </div>

            {loading && !availability ? (
              <p className="empty-state">Loading floor plan availability...</p>
            ) : (
              <div className="tables-grid">
                {availability?.tables?.map((table) => {
                  const isSelected = table.id === selectedTableId;
                  let statusClass = "table-available";
                  let statusBadge = "Available";

                  if (table.booked) {
                    statusClass = "table-booked";
                    statusBadge = "Booked";
                  } else if (!table.fitsParty) {
                    statusClass = "table-too-small";
                    statusBadge = `Max ${table.capacity} Guests`;
                  }

                  return (
                    <button
                      key={table.id}
                      type="button"
                      disabled={!table.available}
                      onClick={() => setSelectedTableId(table.id)}
                      className={`table-card ${statusClass} ${isSelected ? "table-selected" : ""}`}
                    >
                      <div className="table-card-top">
                        <span className="table-id">{table.id}</span>
                        <span className="table-badge">{statusBadge}</span>
                      </div>
                      <div className="table-name">{table.name}</div>
                      <div className="table-meta">
                        <span>Zone: {ZONE_LABELS[table.zone] || table.zone}</span>
                        <span>Capacity: {table.capacity} seats</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="card-panel" aria-labelledby="booking-form-heading">
            <div className="panel-header">
              <h2 id="booking-form-heading">2. Complete Guest Reservation</h2>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="field-group">
                <label htmlFor="selected-table">Selected Table</label>
                <input
                  id="selected-table"
                  type="text"
                  readOnly
                  value={
                    selectedTableId
                      ? `${selectedTableId} (${timeSlot} on ${date} for ${partySize})`
                      : "No available table selected"
                  }
                />
              </div>

              <div className="field-group">
                <label htmlFor="guest-name">Guest Full Name *</label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  minLength={2}
                  placeholder="e.g. Helena Marques"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label htmlFor="guest-contact">Phone or Email *</label>
                <input
                  id="guest-contact"
                  type="text"
                  required
                  minLength={5}
                  placeholder="e.g. helena@example.com or +351 910 000 000"
                  value={guestContact}
                  onChange={(e) => setGuestContact(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label htmlFor="special-requests">Special Requests / Dietary Notes</label>
                <textarea
                  id="special-requests"
                  rows={2}
                  placeholder="Allergies, high chair, anniversary celebration..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting || !selectedTableId}
              >
                {submitting ? "Booking Table..." : "Confirm Table Reservation"}
              </button>
            </form>
          </section>
        </div>

        <section className="card-panel reservations-panel" aria-labelledby="reservations-heading">
          <div className="panel-header">
            <h2 id="reservations-heading">3. Reservations Schedule for {date}</h2>
            <span className="hint-text">{reservations.length} total record(s)</span>
          </div>

          {reservations.length === 0 ? (
            <p className="empty-state">No reservations found for {date}.</p>
          ) : (
            <div className="table-responsive">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Time</th>
                    <th>Table</th>
                    <th>Guest</th>
                    <th>Party</th>
                    <th>Special Requests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id} className={`row-status-${res.status}`}>
                      <td className="mono">{res.id}</td>
                      <td>
                        <strong>{res.timeSlot}</strong>
                      </td>
                      <td>
                        {res.tableId} <span className="muted">({res.tableZone})</span>
                      </td>
                      <td>
                        <div>{res.guestName}</div>
                        <div className="muted small">{res.guestContact}</div>
                      </td>
                      <td>{res.partySize}</td>
                      <td>{res.specialRequests || <span className="muted">—</span>}</td>
                      <td>
                        <span className={`status-pill status-${res.status}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {res.status === "confirmed" && (
                          <button
                            type="button"
                            className="btn-small btn-seat"
                            onClick={() => handleStatusAction(res.id, "seated")}
                          >
                            Seat Guests
                          </button>
                        )}
                        {res.status === "seated" && (
                          <button
                            type="button"
                            className="btn-small btn-complete"
                            onClick={() => handleStatusAction(res.id, "completed")}
                          >
                            Complete
                          </button>
                        )}
                        {(res.status === "confirmed" || res.status === "seated") && (
                          <button
                            type="button"
                            className="btn-small btn-cancel"
                            onClick={() => handleStatusAction(res.id, "cancel")}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
