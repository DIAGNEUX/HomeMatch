import { api } from "@/lib/axios";
import type { AnnonceImage } from "@/types/announcement";

const imageService = {
  upload(annonceId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<{ success: boolean; data: AnnonceImage }>(
      `/announcements/${annonceId}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  remove(annonceId: string, imageId: string) {
    return api.delete<{ success: boolean; message: string }>(
      `/announcements/${annonceId}/images/${imageId}`
    );
  },
};

export default imageService;