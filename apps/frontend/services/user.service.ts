import { api } from "@/lib/axios";
import type { UpdateUserDto, User } from "@/types/auth";

const userService = {
  updateMe(data: UpdateUserDto) {
    return api.patch<{ success: boolean; data: User }>("/users/me", data);
  },
};

export default userService;
