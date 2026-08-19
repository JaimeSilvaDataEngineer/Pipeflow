import { LayoutDashboard, SquareKanban, Users, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "leads", label: "Leads", icon: Users },
  { href: "pipeline", label: "Pipeline", icon: SquareKanban },
  { href: "settings", label: "Settings", icon: Settings },
] as const;
