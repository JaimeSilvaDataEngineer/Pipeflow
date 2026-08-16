import { LayoutDashboard } from "lucide-react";

import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      icon={LayoutDashboard}
      title="Dashboard"
      description="Métricas de vendas e funil de conversão chegam na M4."
    />
  );
}
