# 04 — Full-Stack Restaurant Table Reservation App (Node.js API + React)

This example is a **complete, working full-stack application** built entirely in **Node.js** (`apps/api`) and **React + Vite** (`apps/web`), paired with **Google Antigravity CLI (`agy`)** hierarchical rules, progressive skills, and lifecycle hooks.

---

## 1. Directory Structure

```text
04-restaurant-reservation/
├── README.md                                          # Complete guide & step-by-step feature tutorial
├── AGENTS.md                                          # Root workspace rules & cross-cutting invariants
├── package.json                                       # Root scripts (npm start, npm test, npm run build:web)
├── scripts/
│   └── dev.js                                         # Concurrent runner for API (:4000) + React (:5173)
├── docs/
│   └── adding-functionality-guide.md                  # Deep-dive walkthrough for adding new features
├── packages/
│   └── shared/
│       └── contracts.json                             # Shared timeSlots, zones, statuses, and JSON schemas
├── .agents/
│   ├── hooks.json                                     # PreToolUse safety gate + PostToolUse JS syntax check
│   ├── scripts/
│   │   ├── pre-tool-safety.sh                         # Blocks destructive rm -rf / git reset --hard
│   │   └── post-edit-syntax-check.sh                  # Runs `node --check` automatically after file edits
│   └── skills/
│       └── add-reservation-feature/                   # Skill guiding full-stack feature implementation
│           ├── SKILL.md
│           ├── references/feature-architecture-guide.md
│           └── scripts/verify-fullstack.sh            # Runs syntax checks, API tests, and React build
└── apps/
    ├── api/                                           # Node.js REST API (zero external dependencies)
    │   ├── AGENTS.md                                  # Scoped backend rules
    │   ├── package.json
    │   ├── src/
    │   │   ├── validators.js                          # Pure input validation backed by contracts.json
    │   │   ├── store.js                               # In-memory ReservationStore & conflict engine
    │   │   ├── app.js                                 # HTTP router & standardized JSON envelope helpers
    │   │   └── server.js                              # HTTP server entrypoint (port 4000)
    │   └── tests/
    │       └── api.test.js                            # Automated integration tests (`node --test`)
    └── web/                                           # React 19 + Vite Frontend (port 5173)
        ├── AGENTS.md                                  # Scoped frontend rules
        ├── package.json
        ├── vite.config.js                             # Proxies /api/* requests to http://localhost:4000
        ├── index.html
        └── src/
            ├── main.jsx                               # React root mount
            ├── api.js                                 # Centralized HTTP client for /api/v1/*
            ├── App.jsx                                # Floor plan grid, booking form, and schedule UI
            └── styles.css                             # Responsive dark-mode UI styles
```

---

## 2. Step-by-Step Instructions & What to Expect

Follow the exercises below to verify, run, interact with, and extend the full-stack application.

---

### Exercise 1: Run the Full-Stack Verification Suite (`verify-fullstack.sh` / `npm test`)

#### Instructions
1. Open a terminal and navigate to this example directory:
   ```bash
   cd examples/04-restaurant-reservation
   ```
2. Run the full-stack verification script (or `npm test`):
   ```bash
   ./.agents/skills/add-reservation-feature/scripts/verify-fullstack.sh
   ```

#### What to Expect
The script executes three deterministic verification phases and exits with status `0`:
1. **`==> [1/3] Checking JavaScript syntax in apps/api...`**
   - Runs `node --check` on every `.js` file in `apps/api/src/` and `apps/api/tests/`.
2. **`==> [2/3] Running Node.js API test suite...`**
   - Runs `node --test tests/api.test.js`, executing 6 HTTP integration tests against an ephemeral server:
     ```text
     ▶ BistroNode Restaurant Table Reservation API
       ✔ GET /api/v1/health returns service status and contract configuration
       ✔ GET /api/v1/tables lists tables and filters by zone and minCapacity
       ✔ GET /api/v1/tables/availability marks booked and undersized tables accurately
       ✔ POST /api/v1/reservations books an available table and prevents double-booking
       ✔ POST /api/v1/reservations rejects party sizes exceeding table capacity
       ✔ PATCH and DELETE /api/v1/reservations/:id update status and release the table when cancelled
     ✔ BistroNode Restaurant Table Reservation API
     ℹ tests 6 | pass 6 | fail 0
     ```
3. **`==> [3/3] Verifying React frontend production build...`**
   - Runs `vite build` inside `apps/web/`, bundling `index.html`, CSS, and JSX into `apps/web/dist/` with zero errors, followed by:
     ```text
     ✅ Full-stack verification succeeded!
     ```

---

### Exercise 2: Start the Full-Stack Application (`npm start`) and Use the React UI

#### Instructions
1. From `examples/04-restaurant-reservation`, start both the Node.js API and React Vite dev server concurrently:
   ```bash
   npm start
   ```
   *(Alternatively, run `npm run start:api` in Terminal 1 and `npm run dev:web` in Terminal 2.)*
2. Open **`http://localhost:5173`** in your browser.
3. Try the following actions in the UI:
   - Change **Party Size** from `2 Guests` to `5 Guests`.
   - Change **Party Size** back to `4 Guests`, click on **Table T4 (Patio4 — Garden Patio)** in the Floor Plan grid, fill in **Guest Full Name** (`Diogo Ferreira`) and **Phone or Email** (`diogo@example.com`), and click **Confirm Reservation**.
   - In the **Reservations for `<today>`** table at the bottom, click **Seat Guests** on a confirmed reservation, or click **Cancel** on `T2` (`19:00`).

#### What to Expect
- **Terminal Output on Startup:**
  - `[api] [restaurant-api] Listening on http://localhost:4000`
  - `[web] VITE v6.x.x ready in ... ms -> Local: http://localhost:5173/`
- **When Changing Party Size to `5 Guests`:**
  - Tables `T1` (2 seats), `T2` (2 seats), `T3` (4 seats), and `T4` (4 seats) automatically dim and display badge **`Max 2 Guests`** / **`Max 4 Guests`** (`reason: "INSUFFICIENT_CAPACITY"`).
  - Only `T5` (6 seats, Main Hall) and `T6` (8 seats, Private Dining Room) remain clickable and highlighted in green (**`Available`**).
- **When Booking Table `T4` at `19:00`:**
  - A green banner appears: *"Reservation res_1003 confirmed for Diogo Ferreira on T4 at 19:00!"*
  - Table `T4` immediately flips from green (**`Available`**) to red (**`Booked`**) in the Floor Plan grid.
  - The new reservation appears in the **Reservations** schedule table sorted by time slot.
- **When Clicking `Cancel` on Table `T2` (`19:00`):**
  - The reservation status badge updates to `cancelled`, and Table `T2` immediately flips back to **`Available`** in the Floor Plan grid for the `19:00` slot.

---

### Exercise 3: Test the Node.js REST API & Conflict Rules Directly with `curl`

With the server running (`npm start` or `npm run start:api`), open a second terminal to inspect the raw JSON envelopes returned by the API.

#### Instructions
Run the following three `curl` commands:

```bash
TODAY=$(date +%F)

# 1. Check table availability for 4 guests at 19:00 today
curl -s "http://localhost:4000/api/v1/tables/availability?date=${TODAY}&timeSlot=19:00&partySize=4" | python3 -m json.tool

# 2. Create a valid reservation on Table T3 at 19:00
curl -s -X POST http://localhost:4000/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"tableId\": \"T3\",
    \"guestName\": \"Ines Costa\",
    \"guestContact\": \"ines@example.com\",
    \"date\": \"${TODAY}\",
    \"timeSlot\": \"19:00\",
    \"partySize\": 4,
    \"specialRequests\": \"Quiet corner\"
  }" | python3 -m json.tool

# 3. Attempt to double-book the exact same Table T3 at 19:00
curl -i -s -X POST http://localhost:4000/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"tableId\": \"T3\",
    \"guestName\": \"Outro Cliente\",
    \"guestContact\": \"outro@example.com\",
    \"date\": \"${TODAY}\",
    \"timeSlot\": \"19:00\",
    \"partySize\": 2
  }"
```

#### What to Expect
1. **Command 1 (`GET /api/v1/tables/availability`):**
   - Returns HTTP `200` with `{"data": {"date": "...", "timeSlot": "19:00", "partySize": 4, "totalTables": 6, "availableCount": ..., "tables": [...]}, "meta": {"requestId": "req_...", "timestamp": "..."}}`.
2. **Command 2 (`POST /api/v1/reservations` — first booking on `T3`):**
   - Returns HTTP `201 Created` with the newly created reservation (`"status": "confirmed"`).
3. **Command 3 (`POST /api/v1/reservations` — duplicate booking on `T3` at `19:00`):**
   - Returns **HTTP `409 Conflict`** with the deterministic error envelope:
     ```json
     {
       "error": {
         "code": "TABLE_ALREADY_BOOKED",
         "message": "Table T3 is already booked for 2026-10-22 at 19:00."
       },
       "meta": {
         "requestId": "req_...",
         "timestamp": "..."
       }
     }
     ```

---

### Exercise 4: Use Antigravity CLI (`agy`) to Add New Full-Stack Features Automatically

Because this project includes hierarchical `AGENTS.md` files (`AGENTS.md`, `apps/api/AGENTS.md`, `apps/web/AGENTS.md`), the `add-reservation-feature` skill, and `PreToolUse`/`PostToolUse` hooks in `.agents/hooks.json`, you can launch `agy` and watch it implement end-to-end features across the stack.

#### Instructions
1. Open a terminal in `examples/04-restaurant-reservation` and start `agy`:
   ```bash
   cd examples/04-restaurant-reservation
   agy
   ```
2. Try any of the following prompts:

   - **Prompt A — Add a Special Occasion Field End-to-End:**
     ```text
     Use the add-reservation-feature skill to add an 'occasion' field (none, birthday, anniversary, business) to reservations across contracts.json, the Node.js API, API tests, and the React booking form and schedule table.
     ```
   - **Prompt B — Add a Guest Waitlist Subsystem End-to-End:**
     ```text
     Add a guest waitlist feature (GET and POST /api/v1/waitlist) to the backend with unit tests, and add a Waitlist section in the React UI so guests can join the waitlist when a time slot has 0 available tables.
     ```
   - **Prompt C — Add a Dining Zone Filter to the Floor Plan UI:**
     ```text
     Add a dining zone filter dropdown (All Zones, Window View, Main Dining, Garden Patio, Private Room) to the React floor plan section and verify the fullstack build.
     ```

#### What to Expect When Running `agy`
1. **Skill Activation (`add-reservation-feature`):**
   - `agy` reads `.agents/skills/add-reservation-feature/SKILL.md` and `.agents/skills/add-reservation-feature/references/feature-architecture-guide.md`.
2. **Ordered 6-Step Execution Across Layers:**
   - **Layer 1 (`packages/shared/contracts.json`):** Updates shared enums/schemas first.
   - **Layer 2 (`apps/api/src/validators.js` & `store.js`):** Guided by `apps/api/AGENTS.md`, adds pure validation and store methods without external dependencies.
   - **Layer 3 (`apps/api/src/app.js`):** Exposes or updates `/api/v1/*` routes using `sendSuccess()` and `sendError()` envelopes.
   - ** Automatic `PostToolUse` Hook (`post-edit-syntax-check.sh`):** Every time the agent edits a `.js` file, `.agents/scripts/post-edit-syntax-check.sh` automatically runs `node --check` to catch syntax errors immediately.
   - **Layer 4 (`apps/api/tests/api.test.js`):** Adds automated integration tests for both happy paths (`200`/`201`) and error cases (`400`/`409`).
   - **Layer 5 (`apps/web/src/api.js` & `App.jsx`):** Guided by `apps/web/AGENTS.md`, updates the API client and React UI with accessible labels and error handling.
3. **Final Self-Verification (`verify-fullstack.sh`):**
   - Before completing its response, the agent runs `./.agents/skills/add-reservation-feature/scripts/verify-fullstack.sh`, proving that all backend syntax checks pass, all `node --test` integration tests pass, and `vite build` succeeds.

---

## 3. Architecture & Full Explanation of How Everything Works

The application is divided into **4 clean layers** so both human developers and AI agents can reason about changes predictably:

1. **Shared Contract Layer (`packages/shared/contracts.json`)**
   - Acts as the single source of truth for allowed dining time slots (`17:30`–`21:00`), seating zones (`window`, `main-dining`, `patio`, `private-room`), and reservation statuses (`confirmed`, `seated`, `completed`, `cancelled`).
   - Loaded directly by the backend validator (`apps/api/src/validators.js`) and exposed via `GET /api/v1/health` to the React frontend.

2. **Backend Validation & Domain Store (`apps/api/src/validators.js` & `apps/api/src/store.js`)**
   - `validators.js` contains pure functions (`validateAvailabilityQuery`, `validateCreateReservation`, `validateStatusUpdate`) that sanitize inputs and return `{ valid, errors, value }`.
   - `store.js` defines `ReservationStore`, which holds the 6 restaurant tables (`T1`–`T6`) and active reservations. It enforces two core domain invariants:
     - **Capacity Rule (`CAPACITY_EXCEEDED` / HTTP 400):** A party of 5 cannot book a 2-seat or 4-seat table.
     - **No Double-Booking Rule (`TABLE_ALREADY_BOOKED` / HTTP 409):** A table cannot have two active (`confirmed` or `seated`) bookings on the same `date` and `timeSlot`. Cancelling a booking immediately frees the table for new reservations.

3. **Backend HTTP Transport (`apps/api/src/app.js` & `apps/api/src/server.js`)**
   - Uses Node's built-in `node:http` module and wraps all responses in a consistent JSON envelope:
     - Success: `{ "data": ..., "meta": { "requestId": "req_...", "timestamp": "..." } }`
     - Error: `{ "error": { "code": "...", "message": "..." }, "meta": { "requestId": "req_..." } }`
   - Decouples `createRequestListener(store)` from `server.listen()` so `apps/api/tests/api.test.js` can spin up isolated ephemeral test servers on port `0` in milliseconds.

4. **React Frontend (`apps/web/src/api.js` & `apps/web/src/App.jsx`)**
   - `api.js` centralizes all `fetch()` calls to `/api/v1/*` (which Vite proxies to `http://localhost:4000`), unwraps `payload.data`, and converts backend error envelopes into standard JavaScript `Error` objects.
   - `App.jsx` coordinates three synchronized views:
     1. **Search Filter Bar:** Selects `date`, `timeSlot`, and `partySize`.
     2. **Interactive Floor Plan Grid:** Renders each table card (`T1`–`T6`) with live availability (`Available`, `Booked`, or `Max N Guests`) and lets the user click an available table to select it.
     3. **Booking Form & Schedule Table:** Submits new reservations and provides one-click lifecycle buttons (`Seat Guests`, `Complete`, `Cancel`) that immediately refresh both the schedule and floor plan.

---

## 4. Manual Step-by-Step Code Walkthroughs for Adding Functionality

Below are two complete manual walkthroughs showing **how to code new end-to-end features yourself** across every layer of the stack.

> For an even deeper reference with copy-pasteable code blocks for every file, see [`docs/adding-functionality-guide.md`](./docs/adding-functionality-guide.md).

### Walkthrough A: Adding a "VIP / Special Occasion" Field to Reservations

1. **Add `occasions` to the Shared Contract (`packages/shared/contracts.json`):**
   Add `"occasions": ["none", "birthday", "anniversary", "business"]` at the top level of `packages/shared/contracts.json`.
2. **Validate `occasion` in the Backend (`apps/api/src/validators.js`):**
   In `validateCreateReservation(payload = {})`, default `occasion` to `"none"`, check `CONTRACTS.occasions.includes(occasion)`, and include `occasion` in the returned `value` object.
3. **Persist `occasion` in the Store (`apps/api/src/store.js`):**
   Update `createReservation` in `apps/api/src/store.js` to accept `occasion = "none"` and store it on the created reservation record.
4. **Add a Backend Integration Test (`apps/api/tests/api.test.js`):**
   Add a test verifying that `POST /api/v1/reservations` with `occasion: "anniversary"` returns HTTP `201` and `body.data.occasion === "anniversary"`.
5. **Add the Occasion Selector & Badge in React (`apps/web/src/App.jsx`):**
   Add `const [occasion, setOccasion] = useState("none")`, pass `occasion` to `createReservation()`, add a `<select id="occasion">` to the booking form, and render `res.occasion` in the schedule table.

### Walkthrough B: Adding a "Guest Waitlist" Endpoint & UI Panel

1. **Contract (`packages/shared/contracts.json`):** Add a `WaitlistEntry` schema definition requiring `id`, `guestName`, `guestContact`, `date`, `timeSlot`, `partySize`, and `createdAt`.
2. **Validator (`apps/api/src/validators.js`):** Create `validateWaitlistEntry(payload)` checking `guestName`, `guestContact`, `date`, `timeSlot`, and `partySize`.
3. **Store (`apps/api/src/store.js`):** Initialize `this.waitlist = []` in `ReservationStore.constructor()` and add `listWaitlist({ date })` and `addToWaitlist(...)`.
4. **Router (`apps/api/src/app.js`):** Handle `GET /api/v1/waitlist` and `POST /api/v1/waitlist`.
5. **Frontend (`apps/web/src/api.js` & `apps/web/src/App.jsx`):** Export `fetchWaitlist` and `createWaitlistEntry` and display a Waitlist panel when `availability?.availableCount === 0`.
