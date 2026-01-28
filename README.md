# dcms-desktop

---

# DCMS Desktop (Tauri)

A **minimal cross-platform desktop client** for the DCMS system, built with **Tauri + Rust** and a **plain HTML/CSS/JS frontend**.

This project exists to:

* Validate DCMS backend APIs with a real desktop client
* Test authentication, sessions, and RBAC early
* Provide a foundation for future UI work (Vue / React later)

> **Status:** Login flow works end-to-end against DCMS backend
> **Primary dev OS:** macOS
> **Primary target OS:** Windows 11 (macOS/Linux supported)

---

## 1. High-level architecture

```
[ DCMS Desktop App (Tauri) ]
          |
          |  HTTP (Bearer token)
          v
[ DCMS Rust Backend (Axum) ]
          |
          v
[ PostgreSQL ]
```

Important design decisions:

* Backend runs **as a separate service** (localhost / LAN / cloud)
* Desktop app is a **pure client** (no embedded backend)
* Matches planned production deployment

---

## 2. Repository structure

```
dcms-desktop/
├── frontend/                # Plain HTML/CSS/JS (no framework yet)
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── src-tauri/               # Native shell (Rust)
│   ├── src/
│   │   ├── main.rs          # Tauri entry point
│   │   └── lib.rs
│   ├── capabilities/
│   │   └── default.json     # Tauri permissions (HTTP, etc.)
│   ├── tauri.conf.json
│   ├── build.rs
│   └── icons/
│
├── package.json             # Dev tooling only (Node is NOT shipped)
├── package-lock.json
├── SETUP-Linux.md           # Linux-specific notes
├── .gitignore
└── README.md
```

Key points:

* **frontend/** is normal web code
* **src-tauri/** only handles windowing + native integration
* **Node.js is dev-only**, end users never need it

---

## 3. What currently works ✅

### Desktop app

* Native window opens (Tauri)
* Login screen:

  * username
  * password
  * remember me
* Calls backend:

  * `POST /api/v1/auth/login`
* Stores access token (temporary localStorage)
* Sends `Authorization: Bearer <token>` on API calls

### Backend integration

* CORS configured (dev mode)
* OPTIONS preflight handled
* Desktop login successfully creates backend session

This confirms:

> **Desktop ⇄ Backend auth integration is correct**

---

## 4. Prerequisites (macOS)

### 4.1 macOS system tools

Install Xcode Command Line Tools:

```bash
xcode-select --install
```

This provides:

* clang
* linker
* system headers (required by Rust + Tauri)

---

### 4.2 Rust toolchain (required)

Install Rust via `rustup`:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

Verify:

```bash
rustc --version
cargo --version
```

Known-good:

* `rustc 1.9x+`
* `cargo 1.9x+`

---

### 4.3 Node.js (dev-only)

Node is used **only for development** (Tauri CLI, build scripts).

We recommend **Node 20 LTS**.

Using Homebrew:

```bash
brew install node@20
brew link --force --overwrite node@20
```

Verify:

```bash
node -v
npm -v
```

Expected:

* Node `v20.x`
* npm `10.x`

---

### 4.4 Tauri CLI (Rust)

Install once:

```bash
cargo install tauri-cli
```

Verify:

```bash
cargo tauri --version
```

---

## 5. Clone & setup

```bash
git clone git@github.com:c1truus/dcms-desktop.git
cd dcms-desktop
npm install
```

---

## 6. Running the app (dev)

### 6.1 Start backend first

From **DCMS-Rust-Server**:

```bash
make reset
make run
```

Backend must be running at:

```
http://127.0.0.1:8080
```

---

### 6.2 Start desktop app

From **dcms-desktop**:

```bash
npm run dev
```

Expected:

* Native window opens
* Login screen visible

Default dev credentials:

```
username: admin
password: admin123
```

---

## 7. Known limitations (expected)

These are **not bugs**, just unfinished work:

1. `/api/v1/home` may return 404
   → backend route wiring still in progress

2. Token storage uses `localStorage`
   → will be replaced with OS keychain later

3. No frontend bundler yet
   → plain JS used intentionally for early backend testing

---

## 8. Why this setup matters

This proves:

* Backend API contract works in real clients
* Auth/session logic is sound
* DCMS can support:

  * Desktop apps
  * Web apps
  * Future mobile clients

Everything from here is **incremental UI and UX work**, not core plumbing.

---

## 9. Notes for other platforms

### Windows

* Final target platform
* Builds should be done on Windows or CI Windows runners

### Linux

* Supported (Ubuntu tested)
* See `SETUP-Linux.md`

### macOS

* Development supported
* App signing / notarization comes later

---
## 10. Next steps (roadmap)

* Fix `/api/v1/home` backend route
* Add base-URL settings screen
* Introduce Vite (still plain JS, no framework yet)
* Switch remember-me to OS keychain
* Integrate real UI from Penpot / Vue

---

## Final note to teammates

> If you can run the backend and open the desktop window,
> you are **100% set up correctly**.
