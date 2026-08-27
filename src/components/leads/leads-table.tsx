"use client";

import { useRouter } from "next/navigation";
import { UsersIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { MemberAvatar } from "@/components/leads/member-avatar";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { Lead } from "@/types/lead";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

function LeadsTable({
  leads,
  members,
  workspaceSlug,
}: {
  leads: Lead[];
  members: WorkspaceMember[];
  workspaceSlug: string;
}) {
  const router = useRouter();

  if (leads.length === 0) {
    return (
      <div className="border-border flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
        <UsersIcon className="text-muted-foreground size-8" />
        <h2 className="text-foreground text-base font-semibold">Nenhum lead encontrado</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Ajuste os filtros ou a busca, ou cadastre um novo lead para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer"
              onClick={() => router.push(`/${workspaceSlug}/leads/${lead.id}`)}
            >
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell className="text-muted-foreground">{lead.email}</TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell>
                <MemberAvatar memberId={lead.assignedTo} members={members} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {dateFormatter.format(new Date(lead.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { LeadsTable };
