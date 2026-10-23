# Deep-Dive Guide: Adding Functionality to the Restaurant Reservation App

This guide explains **how each part of `04-restaurant-reservation` is architected** and provides complete, step-by-step code recipes for adding new full-stack functionality.

---

## 1. End-to-End Request Lifecycle Explained

When a user interacts with the React frontend in `apps/web/src/App.jsx`, every action follows a deterministic 6-step path:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. React Component (apps/web/src/App.jsx)                                  │
│    User selects Date, Time Slot, Party Size, and clicks a Table Card.      │
│    Submits form -> calls createReservation(payload) in apps/web/src/api.js │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 2. Frontend API Client (apps/web/src/api.js)                               │
│    Sends HTTP POST /api/v1/reservations (proxied by Vite to :4000).        │
│    Unwraps `payload.data` on 2xx or throws Error(payload.error.message).   │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 3. Node.js HTTP Router (apps/api/src/app.js)                               │
│    Generates a trace `requestId`, parses JSON body with `readJsonBody()`,  │
│    and routes `POST /api/v1/reservations` to validator + store.            │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 4. Contract Validator (apps/api/src/validators.js)                         │
│    Validates fields against `packages/shared/contracts.json`.              │
│    Returns `{ valid: false, errors }` -> HTTP 400 VALIDATION_ERROR.        │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 5. Domain Store (apps/api/src/store.js)                                    │
│    Enforces business rules:                                                │
│    - Does the table exist? (404 TABLE_NOT_FOUND)                           │
│    - Does partySize <= table.capacity? (400 CAPACITY_EXCEEDED)             │
│    - Is the table free at that date + timeSlot? (409 TABLE_ALREADY_BOOKED) │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 6. UI Refresh (apps/web/src/App.jsx)                                       │
│    `await loadData()` re-fetches both `/tables/availability` and           │
│    `/reservations` in parallel via `Promise.all`, updating the floor plan  │
│    and schedule table immediately.                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Recipe: Adding a Full-Stack "Guest Waitlist" Feature

Let's walk through adding a **Waitlist** feature from scratch so guests can join a waitlist when their preferred time slot is full, and staff can remove or seat them.

### Step 1: Update `packages/shared/contracts.json`

Add the `WaitlistEntry` definition inside `"definitions"` in `packages/shared/contracts.json`:

```json
    "WaitlistEntry": {
      "type": "object",
      "required": ["id", "guestName", "guestContact", "date", "timeSlot", "partySize", "createdAt"],
      "properties": {
        "id": { "type": "string", "examples": ["wait_501"] },
        "guestName": { "type": "string", "minLength": 2 },
        "guestContact": { "type": "string", "minLength": 5 },
        "date": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
        "timeSlot": { "type": "string" },
        "partySize": { "type": "integer", "minimum": 1, "maximum": 12 },
        "notes": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" }
      }
    }
```

**Explanation:** By starting with `contracts.json`, both human engineers and AI agents (`agy`) immediately see the exact field names and constraints expected across the stack.

---

### Step 2: Add Validation in `apps/api/src/validators.js`

Append `validateCreateWaitlistEntry` to `apps/api/src/validators.js`:

```javascript
/**
 * Validate payload for adding a party to the waitlist.
 */
export function validateCreateWaitlistEntry(payload = {}) {
  const errors = [];
  const guestName = typeof payload.guestName === "string" ? payload.guestName.trim() : "";
  const guestContact = typeof payload.guestContact === "string" ? payload.guestContact.trim() : "";
  const date = typeof payload.date === "string" ? payload.date.trim() : "";
  const timeSlot = typeof payload.timeSlot === "string" ? payload.timeSlot.trim() : "";
  const partySize = Number(payload.partySize);
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";

  if (guestName.length < 2) {
    errors.push("guestName must be at least 2 characters long.");
  }
  if (guestContact.length < 5) {
    errors.push("guestContact must be at least 5 characters long.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
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
    value: { guestName, guestContact, date, timeSlot, partySize, notes },
  };
}
```

**Explanation:** Keeping validation in a pure function makes it trivial to unit-test and guarantees that `ReservationStore` only receives sanitized, properly typed values (`Number(payload.partySize)`).

---

### Step 3: Add Waitlist State & Methods to `apps/api/src/store.js`

1. In `ReservationStore.constructor()`, initialize:
   ```javascript
   this.nextWaitlistSeq = 501;
   this.waitlist = [];
   ```
2. Add three methods to `ReservationStore`:
   ```javascript
   listWaitlist({ date } = {}) {
     return this.waitlist.filter((entry) => (!date ? true : entry.date === date));
   }

   addWaitlistEntry({ guestName, guestContact, date, timeSlot, partySize, notes = "" }) {
     const entry = {
       id: `wait_${this.nextWaitlistSeq++}`,
       guestName,
       guestContact,
       date,
       timeSlot,
       partySize,
       notes,
       createdAt: new Date().toISOString(),
     };
     this.waitlist.push(entry);
     return entry;
   }

   removeWaitlistEntry(waitlistId) {
     const idx = this.waitlist.findIndex((w) => w.id === waitlistId);
     if (idx === -1) {
       throw new DomainError("WAITLIST_ENTRY_NOT_FOUND", `Waitlist entry '${waitlistId}' not found.`, 404);
     }
     const [removed] = this.waitlist.splice(idx, 1);
     return removed;
   }
   ```

---

### Step 4: Expose Waitlist Endpoints in `apps/api/src/app.js`

Import `validateCreateWaitlistEntry` in `apps/api/src/app.js` and add the routes inside `createRequestListener(store)`:

```javascript
      // GET /api/v1/waitlist
      if (req.method === "GET" && pathname === "/api/v1/waitlist") {
        const date = url.searchParams.get("date") || undefined;
        return sendSuccess(res, 200, store.listWaitlist({ date }), requestId);
      }

      // POST /api/v1/waitlist
      if (req.method === "POST" && pathname === "/api/v1/waitlist") {
        const body = await readJsonBody(req);
        const validation = validateCreateWaitlistEntry(body);
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
        const entry = store.addWaitlistEntry(validation.value);
        return sendSuccess(res, 201, entry, requestId);
      }

      // DELETE /api/v1/waitlist/:id
      const waitlistDeleteMatch = pathname.match(/^\/api\/v1\/waitlist\/([^/]+)$/);
      if (req.method === "DELETE" && waitlistDeleteMatch) {
        const waitlistId = decodeURIComponent(waitlistDeleteMatch[1]);
        const removed = store.removeWaitlistEntry(waitlistId);
        return sendSuccess(res, 200, removed, requestId);
      }
```

---

### Step 5: Add Automated Tests in `apps/api/tests/api.test.js`

Add an integration test to `apps/api/tests/api.test.js`:

```javascript
  it("POST, GET, and DELETE /api/v1/waitlist manage waitlist entries", async () => {
    const createRes = await fetch(`${baseUrl}/api/v1/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "Pedro Nunes",
        guestContact: "+351 919 888 777",
        date: testDate,
        timeSlot: "19:00",
        partySize: 4,
        notes: "Willing to sit at patio or main dining",
      }),
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).data;
    assert.ok(created.id.startsWith("wait_"));

    const listRes = await fetch(`${baseUrl}/api/v1/waitlist?date=${testDate}`);
    const listBody = await listRes.json();
    assert.equal(listBody.data.length, 1);

    const delRes = await fetch(`${baseUrl}/api/v1/waitlist/${created.id}`, {
      method: "DELETE",
    });
    assert.equal(delRes.status, 200);
  });
```

Run `npm --prefix apps/api test` to verify all tests pass!

---

### Step 6: Connect the React Frontend (`apps/web/src/api.js` & `apps/web/src/App.jsx`)

1. In `apps/web/src/api.js`, add the client helpers:
   ```javascript
   export function fetchWaitlist({ date } = {}) {
     const qs = date ? `?date=${encodeURIComponent(date)}` : "";
     return request(`/waitlist${qs}`);
   }

   export function createWaitlistEntry(input) {
     return request("/waitlist", {
       method: "POST",
       body: JSON.stringify(input),
     });
   }

   export function removeWaitlistEntry(waitlistId) {
     return request(`/waitlist/${encodeURIComponent(waitlistId)}`, {
       method: "DELETE",
     });
   }
   ```
2. In `apps/web/src/App.jsx`:
   - Fetch `fetchWaitlist({ date })` inside `loadData()` alongside `fetchAvailability` and `fetchReservations`.
   - Render a **"Join Waitlist"** button or panel so staff can add walk-in or overflow guests and remove them once seated!

---

## 3. How the Antigravity (`agy`) Customizations Assist You

When you run `agy` inside `examples/04-restaurant-reservation/`:

1. **Root & Scoped `AGENTS.md` Files:**
   - Opening files in `apps/api/` automatically loads `apps/api/AGENTS.md` (enforcing the `{ data, meta }` envelope and zero external dependencies).
   - Opening files in `apps/web/` automatically loads `apps/web/AGENTS.md` (enforcing centralized API calls in `src/api.js` and accessible markup).
2. **`add-reservation-feature` Skill (`.agents/skills/add-reservation-feature/SKILL.md`):**
   - Gives the agent the exact 5-step checklist (`contracts.json` → `apps/api` → `api.test.js` → `apps/web` → `verify-fullstack.sh`).
3. **Automatic Lifecycle Hooks (`.agents/hooks.json`):**
   - Every time the agent edits a `.js` file using `edit_file` or `write_file`, `PostToolUse` runs `.agents/scripts/post-edit-syntax-check.sh` (`node --check`).
   - Every time the agent runs a shell command via `run_command`, `PreToolUse` runs `.agents/scripts/pre-tool-safety.sh` to guard against destructive commands.
