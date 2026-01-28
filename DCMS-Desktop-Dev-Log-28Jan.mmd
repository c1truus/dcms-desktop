# DCMS Desktop – Dev Log (Tauri Skeleton)

**Status:** ✅ Login flow works end-to-end
**Date:** 2026-01-28
**Owner:** MT (backend) + EU (frontend)
**Goal:** Verify DCMS backend via a minimal desktop client before UI polish

---

## 1. What we built (TL;DR)

We successfully built a **minimal Tauri desktop app** that:

* Runs on Linux (Ubuntu 24.04)
* Connects to the DCMS Rust backend via HTTP
* Shows a native desktop window
* Implements:

  * Login screen
  * “Remember me” (temporary storage)
  * Authenticated requests with `Authorization: Bearer <token>`

✅ **Login is successful and backend sessions are created correctly**

---

## 2. High-level architecture

```
[Tauri Desktop App]
   |
   |  HTTP (fetch)
   |  Authorization: Bearer <token>
   v
[DCMS Rust Backend (Axum)]
   |
   |  PostgreSQL
   v
[Database]
```

Important design choice:

* **Backend runs as a separate service** (localhost / LAN / cloud)
* Desktop app is a **pure client**, no embedded backend

This matches the planned production architecture.

---

## 3. What works right now ✅

### Desktop (dcms-desktop)

* Native window opens via Tauri
* Static HTML/CSS/JS frontend (no framework)
* Login form:

  * username
  * password
  * remember me
* Successful login:

  * Calls `POST /api/v1/auth/login`
  * Receives `access_token` + `expires_at`
  * Stores token locally (temporary solution)
* Auth header correctly sent on subsequent requests

### Backend (DCMS-Rust-Server)

* CORS enabled (dev mode)
* OPTIONS preflight handled correctly
* Login endpoint hit from desktop
* Session tokens created and validated
* No more `405` or CORS blocking issues

This confirms:

> **Desktop ⇄ Backend integration is fundamentally correct**

---

## 4. Current limitations (known + expected)

These are **not bugs**, just unfinished pieces:

1. `/api/v1/home` returns `404`

   * Desktop calls it correctly
   * Backend route likely not registered / path mismatch
   * Easy backend-side fix later

2. Token storage

   * Currently uses `localStorage` (temporary)
   * Planned: OS secure keychain (Windows Credential Manager, macOS Keychain, Linux keyring)

3. No frontend bundler

   * No Vite / Vue / React yet
   * Means:

     * Cannot use Tauri JS plugins directly
     * Using plain `fetch()` instead
   * This is intentional for early backend testing

---

## 5. Repo structure (important for teammates)

### dcms-desktop

```
dcms-desktop/
├── frontend/
│   ├── index.html      # Login + main view
│   ├── style.css       # Minimal styling
│   └── app.js          # Auth + API logic
│
├── src-tauri/
│   ├── src/
│   │   ├── main.rs     # Tauri entry
│   │   └── lib.rs
│   ├── capabilities/
│   │   └── default.json  # Tauri permissions
│   ├── tauri.conf.json
│   └── icons/
│
├── package.json        # Dev tooling only
└── SETUP-Linux.md
```

Key point:

* **frontend/** is plain web
* **src-tauri/** is only the native shell
* Node.js is **dev-only**, not shipped

---

## 6. Backend change summary (important)

We added **CORS middleware** in `DCMS-Rust-Server/src/main.rs`:

```rust
let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers([
        header::CONTENT_TYPE,
        header::AUTHORIZATION,
        header::ACCEPT,
    ]);

let app = routes::router(state)
    .layer(cors)
    .layer(TraceLayer::new_for_http());
```

Why this was required:

* Desktop WebView behaves like a browser
* Browser sends `OPTIONS` preflight
* Without CORS, backend returned `405`
* That silently blocked login requests

This is **dev-only configuration** and will be tightened later.

---

## 7. How to run (for teammates)

### Backend

```bash
cd DCMS-Rust-Server
make reset
make run
```

Expected:

```
Listening on http://127.0.0.1:8080
```

---

### Desktop

```bash
cd dcms-desktop
npm install
npm run dev
```

Expected:

* Native window opens
* Login with:

  * user: `admin`
  * pass: `admin123`

---

## 8. Why this milestone matters

This proves:

* API contract is usable by real clients
* Auth/session model works outside curl
* DCMS can support:

  * Desktop apps
  * Web apps
  * Future mobile clients

From here, everything else is **incremental**, not foundational.

---

## 9. Next steps (not urgent)

1. Fix `/api/v1/home` route registration
2. Add small Settings screen (base URL)
3. Introduce Vite (still plain JS)
4. Switch remember-me to secure keychain
5. Replace static UI with real design (Penpot / Vue)

---

## Final note to team

> The painful part is done.
> The remaining issues are **normal polish tasks**, not architectural failures.

