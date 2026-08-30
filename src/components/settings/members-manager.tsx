"use client";

import { MailIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog";
import { inviteMember, removeMember, revokeInvite } from "@/app/(dashboard)/[workspace]/settings/members/actions";
import type { PendingInvite } from "@/lib/supabase/invites";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { InviteMemberValues } from "@/lib/validations/invite";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

function MembersManager({
  members,
  pendingInvites,
  workspaceSlug,
  currentUserId,
  isAdmin,
}: {
  members: WorkspaceMember[];
  pendingInvites: PendingInvite[];
  workspaceSlug: string;
  currentUserId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pendingAction, setPendingAction] = React.useState<string | null>(null);

  async function handleInvite(values: InviteMemberValues) {
    await inviteMember(workspaceSlug, values);
    router.refresh();
  }

  async function handleRemoveMember(userId: string) {
    setPendingAction(userId);
    setError(null);
    try {
      await removeMember(workspaceSlug, userId);
      router.refresh();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Algo deu errado.");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleRevokeInvite(inviteId: string) {
    setPendingAction(inviteId);
    setError(null);
    try {
      await revokeInvite(workspaceSlug, inviteId);
      router.refresh();
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : "Algo deu errado.");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Membros</h2>
          <p className="text-muted-foreground text-sm">
            {members.length} {members.length === 1 ? "pessoa" : "pessoas"} neste workspace.
          </p>
        </div>
        {isAdmin && <InviteMemberDialog onSubmit={handleInvite} />}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membro</TableHead>
            <TableHead>Papel</TableHead>
            {isAdmin && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7">
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {member.name} {member.id === currentUserId && "(você)"}
                    </span>
                    <span className="text-muted-foreground text-xs">{member.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                  {member.role === "admin" ? "Administrador" : "Membro"}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  {member.id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pendingAction === member.id}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remover
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAdmin && pendingInvites.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-muted-foreground text-sm font-medium">Convites pendentes</h3>
          <div className="flex flex-col gap-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <MailIcon className="text-muted-foreground size-4" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{invite.email}</span>
                    <span className="text-muted-foreground text-xs">
                      {invite.role === "admin" ? "Administrador" : "Membro"} · expira em{" "}
                      {dateFormatter.format(new Date(invite.expiresAt))}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={pendingAction === invite.id}
                  onClick={() => handleRevokeInvite(invite.id)}
                >
                  <XIcon />
                  <span className="sr-only">Revogar convite</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { MembersManager };
