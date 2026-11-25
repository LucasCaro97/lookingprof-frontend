export type Role = "USER" | "PROFESSIONAL" | "ADMIN";

export type Profession = {
  idProfession: number;
  nameProfession: string;
};

export type Province = {
  idProvince: number;
  nameProvince: string;
};

export type City = {
  idCity: number;
  nameCity: string;
  idProvince?: number | null;
};

export type Professional = {
  idUser: number;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
  profession?: Profession | null;
  province?: Province | null;
  city?: City | null;
  description?: string | null;
  qualification?: number | null;
  role?: Role | null;
};

export type UserProfile = Professional & {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createAt?: string | null;
};

export type ContactInfo = {
  idUser: number;
  email?: string | null;
  phone?: string | null;
};

export type Comment = {
  description: string;
  qualification: number;
  userOrigin: string;
  userDestination: string;
  createdAt?: string | null;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type SearchParams = {
  profession?: string;
  province?: string;
  city?: string;
  professionId?: number;
  provinceId?: number;
  cityId?: number;
  page?: number;
  size?: number;
};

export type AuthPayload = {
  id: number;
  firstName: string;
  lastName: string;
  sub: string;
  imageProfile?: string | null;
  role?: unknown;
  exp?: number;
};

export type Session = {
  token: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  imageProfile?: string | null;
  role: Role | null;
};
