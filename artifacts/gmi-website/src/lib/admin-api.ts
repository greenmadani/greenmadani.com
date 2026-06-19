import { getAdminToken } from "./supabase";

const API = "/api/admin";

async function headers() {
  const token = await getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  if (res.status === 401) {
    window.location.href = "/admin/login";
    return null;
  }
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const adminApi = {
  async get(endpoint: string) {
    const res = await fetch(`${API}${endpoint}`, { headers: await headers() });
    return handleResponse(res);
  },
  async post(endpoint: string, body: unknown) {
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  async put(endpoint: string, body: unknown) {
    const res = await fetch(`${API}${endpoint}`, {
      method: "PUT",
      headers: await headers(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  async del(endpoint: string) {
    const res = await fetch(`${API}${endpoint}`, {
      method: "DELETE",
      headers: await headers(),
    });
    return handleResponse(res);
  },
  async upload(file: File): Promise<string> {
    const token = await getAdminToken();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  },
};
