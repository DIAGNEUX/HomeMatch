import { api } from "@/lib/axios";
import type {
  CreateVisitRequestDto,
  VisitRequest,
  VisitRequestStatus,
} from "@/types/visit-request";

const visitRequestService = {
  create(announcementId: string, data: CreateVisitRequestDto) {
    return api.post<{ success: boolean; data: VisitRequest }>(
      `/visit-requests/announcements/${announcementId}`,
      data
    );
  },

  findReceived() {
    return api.get<{ success: boolean; data: VisitRequest[] }>(
      "/visit-requests/received"
    );
  },

  findMine() {
    return api.get<{ success: boolean; data: VisitRequest[] }>(
      "/visit-requests/mine"
    );
  },

  updateStatus(id: string, status: VisitRequestStatus) {
    return api.patch<{ success: boolean; data: VisitRequest }>(
      `/visit-requests/${id}/status`,
      { status }
    );
  },

  cancel(id: string) {
    return api.patch<{ success: boolean; data: VisitRequest }>(
      `/visit-requests/${id}/cancel`
    );
  },
};

export default visitRequestService;
