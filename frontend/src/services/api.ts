import { API_CONFIG, trimSlash } from "../config/env";
import { CampusEvent, Teacher, UniversityInfoRow } from "../types";

type LoginResult = { ok: boolean; message?: string };

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any)?.message || `Request failed: ${res.status}`);
  }
  return data as T;
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const url = `${trimSlash(API_CONFIG.coreServiceUrl)}/api/auth/register`;
  return jsonFetch<{ ok: boolean; message?: string; token?: string; user?: any }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    const url = `${trimSlash(API_CONFIG.coreServiceUrl)}/api/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.ok) {
      return { ok: false, message: data?.message || "Invalid credentials" };
    }

    return { ok: true };
  } catch (error: any) {
    return { ok: false, message: error?.message || "Login failed" };
  }
}

export async function fetchTeachers() {
  const url = `${trimSlash(API_CONFIG.coreServiceUrl)}/api/teachers`;
  const data = await jsonFetch<{ teachers: Teacher[] }>(url);
  return data.teachers || [];
}

export async function fetchEvents() {
  const url = `${trimSlash(API_CONFIG.coreServiceUrl)}/api/events`;
  const data = await jsonFetch<{ events: CampusEvent[] }>(url);
  return data.events || [];
}

export async function fetchUniversityInfo() {
  const url = `${trimSlash(API_CONFIG.coreServiceUrl)}/api/university`;
  const data = await jsonFetch<{ info: UniversityInfoRow[] }>(url);
  return data.info || [];
}

export async function fetchUniversityInfoByKey(key: string) {
  const url = `${trimSlash(API_CONFIG.coreServiceUrl)}/api/university/${encodeURIComponent(key)}`;
  return jsonFetch<UniversityInfoRow>(url);
}

export async function sendChatMessage(message: string) {
  const url = `${trimSlash(API_CONFIG.aiServiceUrl)}/chat`;
  const data = await jsonFetch<{ reply?: string; message?: string }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  return data.reply || data.message || "Sorry, I could not answer that right now.";
}
