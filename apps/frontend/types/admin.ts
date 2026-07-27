export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "USER" | "AGENCY" | "ADMIN";
  isActive: boolean;
  createdAt: string;
};

export type AgencyAdmin = {
  id: string;
  name: string;
  siret: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  createdAt: string;
  _count: { annonces: number };
};

export type AgencyAdminDetail = Omit<AgencyAdmin, "_count"> & {
  annonces: import("./announcement").Annonce[];
};

export type AdminStats = {
  totalUsers: number;
  totalAgencies: number;
  totalAnnonces: number;
  publishedCount: number;
  draftCount: number;
  inactiveUsers: number;
  recentAgencies: AgencyAdmin[];
};