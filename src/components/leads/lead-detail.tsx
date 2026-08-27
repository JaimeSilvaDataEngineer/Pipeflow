"use client";

import { ArrowLeftIcon, ClockIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { updateLead } from "@/app/(dashboard)/[workspace]/leads/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadFormSheet } from "@/components/leads/lead-form-sheet";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { MemberAvatar } from "@/components/leads/member-avatar";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { LeadFormValues } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

function LeadDetail({
  lead: initialLead,
  members,
  workspaceSlug,
}: {
  lead: Lead;
  members: WorkspaceMember[];
  workspaceSlug: string;
}) {
  const [lead, setLead] = React.useState(initialLead);

  async function handleEdit(values: LeadFormValues) {
    const updated = await updateLead(workspaceSlug, lead.id, values);
    setLead(updated);
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/${workspaceSlug}/leads`}
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Voltar para leads
      </Link>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle>{lead.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{lead.roleTitle}</p>
            </div>
            <LeadFormSheet
              lead={lead}
              members={members}
              onSubmit={handleEdit}
              trigger={
                <Button variant="outline" size="icon-sm">
                  <PencilIcon />
                  <span className="sr-only">Editar lead</span>
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <LeadStatusBadge status={lead.status} />

            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">E-mail</dt>
                <dd>{lead.email}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">Telefone</dt>
                <dd>{lead.phone}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">Empresa</dt>
                <dd>{lead.company}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">Responsável</dt>
                <dd>
                  <MemberAvatar memberId={lead.assignedTo} members={members} />
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">Criado em</dt>
                <dd>{dateFormatter.format(new Date(lead.createdAt))}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-border flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
              <ClockIcon className="text-muted-foreground size-8" />
              <p className="text-muted-foreground max-w-sm text-sm">
                A timeline de atividades (ligações, e-mails, reuniões e notas) chega na M4.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { LeadDetail };
