console.log("✅ app.js loaded");

const DEFAULT_BASE_URL = "http://127.0.0.1:8080";

let session = {
  baseUrl: DEFAULT_BASE_URL,
  token: null,
  expiresAt: null,
  remember: false,
};

const $ = (id) => document.getElementById(id);

function showLogin() {
  $("view-login").classList.remove("hidden");
  $("view-main").classList.add("hidden");
  $("login-error").textContent = "";
  $("main-error").textContent = "";
}

function showMain() {
  $("view-login").classList.add("hidden");
  $("view-main").classList.remove("hidden");
  $("login-error").textContent = "";
  $("main-error").textContent = "";
}

function setEnvText() {
  $("env").textContent = "Dev (Tauri static)";
  $("base-url").textContent = session.baseUrl;
  $("expires-at").textContent = session.expiresAt ?? "(unknown)";
}

function formatJson(x) {
  try { return JSON.stringify(x, null, 2); } catch { return String(x); }
}

async function api(path, { method = "GET", body = null } = {}) {
  const url = `${session.baseUrl}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (session.token) headers["Authorization"] = `Bearer ${session.token}`;

  console.log("➡️ API", method, url);

  const resp = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }

  if (resp.ok) return data;

  const code = data?.error?.code || "HTTP_ERROR";
  const msg = data?.error?.message || data?.message || `${resp.status} ${resp.statusText}`;

  const e = new Error(msg);
  e.code = code;
  e.status = resp.status;
  e.payload = data;
  throw e;
}

async function loadHome() {
  try {
    const data = await api("/api/v1/home");
    $("home-json").textContent = formatJson(data);
    $("main-error").textContent = "";
  } catch (e) {
    console.error("HOME ERROR:", e);
    if (e.status === 401 || e.code === "SESSION_EXPIRED") {
      await clearSession();
      showLogin();
      $("login-error").textContent = "Session expired. Please login again.";
      return;
    }
    $("main-error").textContent = `${e.code}: ${e.message}`;
    $("home-json").textContent = formatJson(e.payload || {});
  }
}

// --- Remember-me storage for NOW: localStorage (temporary) ---
// We'll replace this with secure keychain once we add a proper bundler/dev server.
const LS_TOKEN = "dcms.access_token";
const LS_EXPIRES = "dcms.expires_at";

async function restoreSessionIfAny() {
  const token = localStorage.getItem(LS_TOKEN);
  const expiresAt = localStorage.getItem(LS_EXPIRES);

  if (token) {
    session.token = token;
    session.expiresAt = expiresAt || null;
    session.remember = true;
    setEnvText();
    showMain();
    await loadHome();
  } else {
    showLogin();
  }
}

async function persistSessionIfNeeded() {
  if (!session.remember) return;
  localStorage.setItem(LS_TOKEN, session.token ?? "");
  localStorage.setItem(LS_EXPIRES, session.expiresAt ?? "");
}

async function clearSession() {
  session.token = null;
  session.expiresAt = null;
  session.remember = false;
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_EXPIRES);
  setEnvText();
}

async function doLogin(username, password, remember) {
  session.remember = remember;

  const data = await api("/api/v1/auth/login", {
    method: "POST",
    body: { username, password, device_name: "DCMS Desktop (dev)" },
  });

  const payload = data?.data ?? data;
  session.token = payload.access_token;
  session.expiresAt = payload.expires_at;

  await persistSessionIfNeeded();
}

function wireUi() {
  $("login-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    $("login-error").textContent = "";

    const username = $("username").value.trim();
    const password = $("password").value;
    const remember = $("remember").checked;

    try {
      console.log("🟦 Login clicked:", { username, remember });
      await doLogin(username, password, remember);
      setEnvText();
      showMain();
      await loadHome();
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      const payload = e.payload ? "\n" + JSON.stringify(e.payload, null, 2) : "";
      $("login-error").textContent = `${e.code}: ${e.message}${payload}`;
    }
  });

  $("btn-refresh").addEventListener("click", loadHome);

  $("btn-logout").addEventListener("click", async () => {
    try { await api("/api/v1/auth/logout", { method: "POST" }); } catch {}
    await clearSession();
    showLogin();
  });
}

setEnvText();
wireUi();
restoreSessionIfAny();

