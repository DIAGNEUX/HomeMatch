import { api } from "@/lib/axios";
import type { AdminUser, AgencyAdmin, AgencyAdminDetail, AdminStats } from "@/types/admin";


const adminService = {
  getUsers() {
    return api.get<{ success: boolean; data: AdminUser[] }>("/admin/users");
  },

  deactivateUser(id: string) {
    return api.patch<{ success: boolean; data: AdminUser }>(
      `/admin/users/${id}/deactivate`
    );
  },

  getAgencies() {
    return api.get<{ success: boolean; data: AgencyAdmin[] }>(
      "/admin/agencies"
    );
  },

  getAgencyById(id: string) {
    return api.get<{ success: boolean; data: AgencyAdminDetail }>(
      `/admin/agencies/${id}`
    );
  },

  deleteAnnonce(id: string) {
    return api.delete<{ success: boolean; message: string }>(
      `/admin/announcements/${id}`
    );
  },

  getStats() {
  return api.get<{ success: boolean; data: AdminStats }>("/admin/stats");
},
};

export default adminService;