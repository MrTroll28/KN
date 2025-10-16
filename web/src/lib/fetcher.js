const API =
  import.meta.env.VITE_API_URL || "https://schedulehub-server.onrender.com/api";

export function authHeader() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, authHeader());
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).message || "API error");
  return res.json();
}

export const Slots = [
  "MORNING_A",
  "MORNING_B",
  "AFTERNOON_A",
  "AFTERNOON_B",
  "EVENING",
];
export const SlotLabels = {
  MORNING_A: "Sáng A",
  MORNING_B: "Sáng B",
  AFTERNOON_A: "Chiều A",
  AFTERNOON_B: "Chiều B",
  EVENING: "Tối",
};
