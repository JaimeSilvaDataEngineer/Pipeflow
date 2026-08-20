import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMemberById } from "@/lib/mock/members";
import { cn } from "@/lib/utils";

function MemberAvatar({ memberId, className }: { memberId: string; className?: string }) {
  const member = getMemberById(memberId);

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
