import { BriefcaseIcon, TrendingUpIcon, UsersIcon, WalletIcon } from "lucide-react";

import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { UpcomingDealsTable } from "@/components/dashboard/upcoming-deals-table";
import { formatCurrency } from "@/lib/formatCurrency";
import { getDashboardMetrics, getFunnelData, getUpcomingDeals } from "@/lib/mock/dashboard";
import { mockDelay } from "@/lib/mock/delay";

export default async function DashboardPage() {
  await mockDelay();

  const metrics = getDashboardMetrics();
  const funnelData = getFunnelData();
  const upcomingDeals = getUpcomingDeals();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={UsersIcon} label="Total de leads" value={String(metrics.totalLeads)} />
        <MetricCard
          icon={BriefcaseIcon}
          label="Negócios abertos"
          value={String(metrics.openDealsCount)}
        />
        <MetricCard
          icon={WalletIcon}
          label="Valor do pipeline"
          value={formatCurrency(metrics.pipelineValueCents)}
        />
        <MetricCard
          icon={TrendingUpIcon}
          label="Taxa de conversão"
          value={`${Math.round(metrics.conversionRate * 100)}%`}
        />
      </div>

      <FunnelChart data={funnelData} />
      <UpcomingDealsTable deals={upcomingDeals} />
    </div>
  );
}
