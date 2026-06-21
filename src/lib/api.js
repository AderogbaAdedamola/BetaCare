// Small fetch wrapper. No heavy client needed at this scale.
// JWT is kept in memory (module-level) — survives route changes, cleared on full reload.
// This trades "stay logged in on refresh" for not putting a token in localStorage.
// Fine for a hackathon demo; swap for httpOnly cookies if this goes further.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const STORAGE_KEY = import.meta.env.VITE_API_STORAGE_KEY || "session";

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, role: null, id: null };
  } catch {
    return { token: null, role: null, id: null };
  }
}

let { token, role, id } = readStoredSession();

export function setSession(nextToken, nextRole, nextId) {
  token = nextToken;
  role = nextRole;
  id = nextId;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, role, id }));
}

export function clearSession() {
  token = null;
  role = null;
  id = null;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getRole() {
  return role;
}

export function getId() {
  return id;
}

export function isAuthenticated() {
  return Boolean(token);
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearSession();
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
};
