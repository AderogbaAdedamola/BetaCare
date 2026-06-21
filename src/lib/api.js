import axios from "axios";

// Axios-based API client.
// JWT is kept in sessionStorage — survives a refresh mid-demo, clears on tab close.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const STORAGE_KEY = "betacare_session";

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, role: null };
  } catch {
    return { token: null, role: null };
  }
}

let { token, role } = readStoredSession();

export function setSession(nextToken, nextRole) {
  token = nextToken;
  role = nextRole;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, role }));
}

export function clearSession() {
  token = null;
  role = null;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getRole() {
  return role;
}

export function isAuthenticated() {
  return Boolean(token);
}

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every outgoing request.
client.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear the session on 401 so AuthGuard redirects to login on the next render.
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }
    return Promise.reject(error);
  }
);

async function request(path, { method = "GET", body } = {}) {
  try {
    const res = await client.request({ url: path, method, data: body });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    throw new Error(message);
  }
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};