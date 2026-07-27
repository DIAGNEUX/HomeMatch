import { api } from "@/lib/axios";
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterAgencyDto,
  RegisterAgencyResponse,
  User,
} from "@/types/auth";

const authService = {
  login(data: LoginDto) {
    return api.post<LoginResponse>("/auth/login", data);
  },

  register(data: RegisterDto) {
    return api.post("/auth/register", data);
  },

  registerAgency(data: RegisterAgencyDto) {
    return api.post<RegisterAgencyResponse>("/auth/register/agency", data);
  },

  me(options?: { skipAuthRedirect?: boolean }) {
    return api.get<User>("/auth/me", {
      skipAuthRedirect: options?.skipAuthRedirect,
    });
  },

  logout() {
    return api.post<{ success: boolean; message: string }>("/auth/logout");
  },
};

export default authService;
