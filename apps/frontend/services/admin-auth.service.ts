import { api } from "@/lib/axios";
import { LoginDto } from "@/types/auth";

const adminAuthService = {
  login(data: LoginDto) {
    return api.post("/admin/login", data);
  },

  me() {
    return api.get("/admin/me");
  },
};

export default adminAuthService;
