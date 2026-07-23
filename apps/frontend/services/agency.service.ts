import { api } from "@/lib/axios";
import {
  CreateAgencyDto,
  UpdateAgencyDto,
  Agency,
} from "@/types/agency";

const agencyService = {
  create(data: CreateAgencyDto) {
    return api.post<Agency>("/agencies", data);
  },

  me() {
    return api.get<Agency>("/agencies/me");
  },

  update(data: UpdateAgencyDto) {
    return api.patch<Agency>("/agencies/me", data);
  },
};

export default agencyService;