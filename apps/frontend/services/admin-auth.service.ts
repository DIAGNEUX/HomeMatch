import { api } from "@/lib/axios";
import { LoginDto, LoginResponse, User } from "@/types/auth";

const adminAuthService = {
  login(data: LoginDto) {
    return api.post<LoginResponse>("/admin/login", data);
  },

  me(options?: { skipAuthRedirect?: boolean }) {
    return api.get<User>("/admin/me", {
      skipAuthRedirect: options?.skipAuthRedirect,
    });
  },
};

export default adminAuthService;
