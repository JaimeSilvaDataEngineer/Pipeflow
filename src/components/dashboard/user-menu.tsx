"use client";

import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockSignOut } from "@/app/(auth)/actions";
import { MOCK_USER } from "@/lib/mock/workspace";

function UserMenu({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-3">
            <Avatar>
              <AvatarFallback>{MOCK_USER.initials}</AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="text-foreground text-sm font-medium">{MOCK_USER.name}</span>
          <span className="text-muted-foreground text-xs font-normal">{MOCK_USER.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<a href={`/${workspaceSlug}/settings`} />}
        >
          <User />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href={`/${workspaceSlug}/settings`} />}>
          <Settings />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => mockSignOut()}>
          <LogOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserMenu };
