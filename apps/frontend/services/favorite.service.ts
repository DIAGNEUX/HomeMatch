import { api } from "@/lib/axios";
import type { Favorite, FavoriteStatus } from "@/types/favorite";

const favoriteService = {
  add(announcementId: string) {
    return api.post<{ success: boolean; data: Favorite }>(
      `/favorites/announcements/${announcementId}`
    );
  },

  remove(announcementId: string) {
    return api.delete<{ success: boolean; message: string }>(
      `/favorites/announcements/${announcementId}`
    );
  },

  findMine() {
    return api.get<{ success: boolean; data: Favorite[] }>("/favorites/mine");
  },

  getStatus(announcementId: string) {
    return api.get<{ success: boolean; data: FavoriteStatus }>(
      `/favorites/announcements/${announcementId}/status`
    );
  },
};

export default favoriteService;
