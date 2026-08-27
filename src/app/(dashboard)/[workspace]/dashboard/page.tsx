import { notFound } from "next/navigation";
import { BriefcaseIcon, TrendingUpIcon, UsersIcon, WalletIcon } from "lucide-react";

import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { UpcomingDealsTable } from "@/components/dashboard/upcoming-deals-table";
import { formatCurrency } from "@/lib/formatCurrency";
import { getDashboardData } from "@/lib/supabase/dashboard";
import { getLeadsByIds } from "@/lib/supabase/leads";
import { getWorkspaceMembers } from "@/lib/supabase/members";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";

export default async function DashboardPage({ params }: { params: { workspace: string } }) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);

  if (!workspace) notFound();

  const { metrics, funnelData, upcomingDeals } = await getDashboardData(supabase, workspace.id);

  const upcomingLeadIds = Array.from(
    new Set(upcomingDeals.map((deal) => deal.leadId).filter((id): id is string => id !== null)),
  );

  const [leads, members] = await Promise.all([
    getLeadsByIds(supabase, workspace.id, upcomingLeadIds),
    getWorkspaceMembers(supabase, workspace.id),
  ]);

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
      <UpcomingDealsTable deals={upcomingDeals} leads={leads} members={members} />
    </div>
  );
}
