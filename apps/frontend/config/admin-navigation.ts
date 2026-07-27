import { LayoutDashboard, Building, Users } from "lucide-react";

export const adminNavigation = [
  {
    label: "Tableau de bord",
    href: "/homematch/intranet",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Agences & annonces",
    href: "/homematch/intranet/agencies",
    icon: Building,
  },
  {
    label: "Utilisateurs",
    href: "/homematch/intranet/users",
    icon: Users,
  },
];