import type {
  City,
  Comment,
  ContactInfo,
  PageResponse,
  Profession,
  Professional,
  Province,
  SearchParams,
  UserProfile,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const emptyPage: PageResponse<Professional> = {
  content: [],
  page: 0,
  size: 12,
  totalElements: 0,
  totalPages: 0,
};

export function imageUrl(imageName?: string | null): string | null {
  if (!imageName) return null;
  if (
    imageName.startsWith("http") ||
    imageName.startsWith("blob:") ||
    imageName.startsWith("data:")
  ) {
    return imageName;
  }
  return `${API_URL}/user/images/${imageName}`;
}

export function whatsappUrl(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("54") ? digits : `549${digits}`;
  return `https://wa.me/${withCountry}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await safeError(response);
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function safeError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return response.statusText;
    try {
      const json = JSON.parse(text) as { message?: string; error?: string };
      return json.message ?? json.error ?? text;
    } catch {
      return text;
    }
  } catch {
    return response.statusText;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function searchProfessionals(
  params: SearchParams = {},
): Promise<PageResponse<Professional>> {
  const query = new URLSearchParams();
  if (params.profession) query.set("profession", params.profession);
  if (params.province) query.set("province", params.province);
  if (params.city) query.set("city", params.city);
  if (params.professionId) query.set("professionId", String(params.professionId));
  if (params.provinceId) query.set("provinceId", String(params.provinceId));
  if (params.cityId) query.set("cityId", String(params.cityId));
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 12));

  try {
    return await request<PageResponse<Professional>>(
      `/professionals?${query.toString()}`,
    );
  } catch {
    return emptyPage;
  }
}

export async function getProfessional(id: number, token?: string | null) {
  return request<Professional | UserProfile>(`/user/${id}`, {}, token);
}

export async function getContact(id: number, token: string) {
  return request<ContactInfo>(`/user/${id}/contact`, {}, token);
}

export async function getComments(professionalId: number) {
  try {
    return await request<Comment[]>(
      `/comment/getByUserDestination/${professionalId}`,
    );
  } catch {
    return [];
  }
}

export async function getProfessions() {
  try {
    return await request<Profession[]>("/profession/get");
  } catch {
    return [];
  }
}

export async function getProvinces() {
  try {
    return await request<Province[]>("/provinces/get");
  } catch {
    return [];
  }
}

export async function getCities() {
  try {
    return await request<City[]>("/city/get");
  } catch {
    return [];
  }
}

export async function login(email: string, password: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(body: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "USER" | "PROFESSIONAL";
  provinceId: number;
  cityId: number;
}) {
  return request<{ token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateProfile(
  id: number,
  token: string,
  data: {
    phone?: string;
    province?: number;
    city?: number;
    profession?: number;
    description?: string;
    image?: File | null;
  },
) {
  const form = new FormData();
  if (data.phone) form.append("phone", data.phone);
  if (data.province) form.append("province", String(data.province));
  if (data.city) form.append("city", String(data.city));
  if (data.profession) form.append("profession", String(data.profession));
  if (data.description !== undefined) form.append("description", data.description);
  if (data.image) form.append("image", data.image);
  return request<UserProfile>(
    `/user/${id}`,
    { method: "PUT", body: form },
    token,
  );
}

export async function createComment(
  token: string,
  body: { description: string; qualification: number; userDestination: number },
) {
  return request<Comment>(
    "/comment",
    { method: "POST", body: JSON.stringify(body) },
    token,
  );
}

export async function sendSupport(body: {
  fromName: string;
  fromEmail: string;
  subject: string;
  text: string;
}) {
  return request<unknown>("/supportContact/send", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function firstQuery(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
