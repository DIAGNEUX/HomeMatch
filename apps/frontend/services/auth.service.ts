import { api } from "@/lib/axios";
import {
  LoginDto,
  RegisterDto,
  RegisterAgencyDto,
  User,
} from "@/types/auth";

const authService = {
  login(data: LoginDto) {
    return api.post("/auth/login", data);
  },

  register(data: RegisterDto) {
    return api.post("/auth/register", data);
  },

  registerAgency(data: RegisterAgencyDto) {
    return api.post("/auth/register/agency", data);
  },

  me() {
    return api.get<User>("/auth/me");
  },
};

export default authService;
