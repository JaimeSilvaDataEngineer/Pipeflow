import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { WorkspaceMember } from "@/lib/supabase/members";

function MemberAvatar({
  memberId,
  members,
  className,
}: {
  memberId: string | null;
  members: WorkspaceMember[];
  className?: string;
}) {
  const member = members.find((item) => item.id === memberId);

  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("size-6", className)}>
        <AvatarFallback>{member?.initials ?? "?"}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{member?.name ?? "Sem responsável"}</span>
    </div>
  );
}

export { MemberAvatar };
