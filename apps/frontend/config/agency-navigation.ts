import {
  CalendarDays,
  House,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

export const agencyNavigation = [
  {
    label: "Tableau de bord",
    href: "/agency",
    icon: LayoutDashboard,
  },
  {
    label: "Mes annonces",
    href: "/agency/properties",
    icon: House,
  },
  {
    label: "Demandes de visite",
    href: "/agency/visits",
    icon: CalendarDays,
  },
  {
    label: "Profil",
    href: "/agency/profile",
    icon: User,
  },
  {
    label: "Paramètres",
    href: "/agency/settings",
    icon: Settings,
  },
];