import { LayoutDashboard, Users, Building, House, User } from "lucide-react";

export const adminNavigation = [
  {
    label: "Tableau de bord",
    href: "/homematch/intranet",
    icon: LayoutDashboard,
  },
  {
    label: "Annonces",
    href: "/homematch/intranet/announcements",
    icon: House,
  },
  {
    label: "Agences",
    href: "/homematch/intranet/agencies",
    icon: Building,
  },
  {
    label: "Utilisateurs",
    href: "/homematch/intranet/users",
    icon: Users,
  },
  {
    label: "Profil",
    href: "/homematch/intranet/profile",
    icon: User,
  },
];
