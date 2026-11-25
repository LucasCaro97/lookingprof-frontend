import type { AuthPayload, Role, Session } from "./types";

const TOKEN_KEY = "jwt";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): AuthPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as AuthPayload;
  } catch {
    return null;
  }
}

export function roleFromPayload(role: unknown): Role | null {
  if (typeof role === "string") {
    return isRole(role) ? role : null;
  }
  if (Array.isArray(role) && role[0]) {
    const first = role[0];
    if (typeof first === "string") return isRole(first) ? first : null;
    if (typeof first === "object" && first && "authority" in first) {
      const authority = (first as { authority: string }).authority;
      return isRole(authority) ? authority : null;
    }
  }
  return null;
}

function isRole(value: string): value is Role {
  return value === "USER" || value === "PROFESSIONAL" || value === "ADMIN";
}

export function sessionFromToken(token: string): Session | null {
  const payload = decodeToken(token);
  if (!payload?.id) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return {
    token,
    id: payload.id,
    firstName: payload.firstName ?? "",
    lastName: payload.lastName ?? "",
    email: payload.sub ?? "",
    imageProfile: payload.imageProfile,
    role: roleFromPayload(payload.role),
  };
}
