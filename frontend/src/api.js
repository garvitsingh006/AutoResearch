const BASE = import.meta.env.VITE_BACKEND_URL || '/api';

const req = (method, path, body) =>
  fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Something went wrong");
    return data;
  });

export const api = {
  signup: (body) => req("POST", "/users/signup", body),
  login: (body) => req("POST", "/users/login", body),
  logout: () => req("POST", "/users/logout"),
  me: () => req("GET", "/me"),
  newPaper: (query) => req("POST", "/me/new", { query }),
};
