"use client";

import { Cell, Funnel, FunnelChart as RechartsFunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStageData } from "@/lib/supabase/dashboard";

const FUNNEL_COLORS: Record<string, string> = {
  novo_lead: "#94a3b8",
  contato_realizado: "#3b82f6",
  proposta_enviada: "#f59e0b",
  negociacao: "#f59e0b",
  fechado_ganho: "#22c55e",
};

function FunnelChart({ data }: { data: FunnelStageData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Funil de vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsFunnelChart>
              <Tooltip
                formatter={(value) => [`${value} negócio${value === 1 ? "" : "s"}`, ""]}
                labelFormatter={() => ""}
              />
              <Funnel dataKey="count" data={data} nameKey="label" isAnimationActive>
                <LabelList
                  position="right"
                  dataKey="label"
                  fill="var(--foreground)"
                  stroke="none"
                  fontSize={12}
                />
                {data.map((stage) => (
                  <Cell key={stage.stageId} fill={FUNNEL_COLORS[stage.stageId]} />
                ))}
              </Funnel>
            </RechartsFunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export { FunnelChart };
