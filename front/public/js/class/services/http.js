import { HOST } from "../../../data/host.js";

export async function apiFetch(path, { method = "GET", body, headers, timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${HOST}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(headers || {}) },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }

    if (!res.ok) {
      const msg = json?.error || json?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return json;
  } finally {
    clearTimeout(t);
  }
}
