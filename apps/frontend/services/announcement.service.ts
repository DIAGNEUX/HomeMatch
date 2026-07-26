import { api } from "@/lib/axios";
import {
  Annonce,
  CreateAnnonceDto,
  UpdateAnnonceDto,
  SearchAnnonceParams,
  SearchAnnoncesResponse,
} from "@/types/announcement";

const announcementService = {
  search(params: SearchAnnonceParams) {
    return api.get<SearchAnnoncesResponse>("/announcements", { params });
  },

  findMine() {
    return api.get<{ success: boolean; data: Annonce[] }>(
      "/announcements/mine"
    );
  },

  findOne(id: string) {
    return api.get<{ success: boolean; data: Annonce }>(`/announcements/${id}`);
  },

  create(data: CreateAnnonceDto) {
    return api.post<{ success: boolean; data: Annonce }>("/announcements", data);
  },

  update(id: string, data: UpdateAnnonceDto) {
    return api.patch<{ success: boolean; data: Annonce }>(
      `/announcements/${id}`,
      data
    );
  },

  remove(id: string) {
    return api.delete<{ success: boolean; message: string }>(
      `/announcements/${id}`
    );
  },

  publish(id: string) {
    return api.patch<{ success: boolean; data: Annonce }>(
      `/announcements/${id}/publish`
    );
  },
};

export default announcementService;