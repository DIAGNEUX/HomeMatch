export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phone?: string;
  role: "USER" | "AGENCY" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export type AgencyRegisterFormData = RegisterAgencyDto & {
  confirmPassword: string;

  // Informations agence
  name: string;
  description?: string;
  siret: string;
  website?: string;
  address: string;
  city: string;
  postalCode: string;
};
export interface RegisterAgencyResponse {
  access_token: string;
  user: User;
}
export type RegisterResponse = User;

export interface RegisterAgencyDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
}