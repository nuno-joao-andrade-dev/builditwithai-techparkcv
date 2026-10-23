const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    const message =
      payload?.error?.message || `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.code = payload?.error?.code || "HTTP_ERROR";
    err.status = response.status;
    throw err;
  }

  return payload.data;
}

export function fetchHealthAndConfig() {
  return request("/health");
}

export function fetchAvailability({ date, timeSlot, partySize }) {
  const params = new URLSearchParams({
    date,
    timeSlot,
    partySize: String(partySize),
  });
  return request(`/tables/availability?${params.toString()}`);
}

export function fetchReservations({ date, status } = {}) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (status) params.set("status", status);
  const qs = params.toString();
  return request(`/reservations${qs ? `?${qs}` : ""}`);
}

export function createReservation(reservationInput) {
  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(reservationInput),
  });
}

export function updateReservationStatus(reservationId, status) {
  return request(`/reservations/${encodeURIComponent(reservationId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function cancelReservation(reservationId) {
  return request(`/reservations/${encodeURIComponent(reservationId)}`, {
    method: "DELETE",
  });
}
