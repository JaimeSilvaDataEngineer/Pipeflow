import { MemberAvatar } from "@/components/leads/member-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import type { WorkspaceMember } from "@/lib/supabase/members";
import { cn } from "@/lib/utils";
import type { Deal } from "@/types/deal";
import type { Lead } from "@/types/lead";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

function dueDateClassName(dueDate: string, now: number) {
  const diffDays = (new Date(dueDate).getTime() - now) / (24 * 60 * 60 * 1000);
  if (diffDays < 0) return "text-red-600 font-medium";
  if (diffDays <= 3) return "text-amber-700 font-medium";
  return "text-muted-foreground";
}

function UpcomingDealsTable({
  deals,
  leads,
  members,
}: {
  deals: Deal[];
  leads: Lead[];
  members: WorkspaceMember[];
}) {
  const now = Date.now();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Negócios com prazo próximo</CardTitle>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Nenhum negócio aberto no momento.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negócio</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => {
                const lead = leads.find((item) => item.id === deal.leadId);
                return (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead?.company ?? "—"}
                    </TableCell>
                    <TableCell>{formatCurrency(deal.valueCents)}</TableCell>
                    <TableCell>
                      <MemberAvatar memberId={deal.assignedTo} members={members} />
                    </TableCell>
                    <TableCell
                      className={cn("text-right", deal.dueDate ? dueDateClassName(deal.dueDate, now) : "text-muted-foreground")}
                    >
                      {deal.dueDate ? dateFormatter.format(new Date(deal.dueDate)) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export { UpcomingDealsTable };
