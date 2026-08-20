"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronsUpDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MOCK_WORKSPACES } from "@/lib/mock/workspace";

function WorkspaceSwitcher({ workspaceSlug }: { workspaceSlug: string }) {
  const router = useRouter();
  const active =
    MOCK_WORKSPACES.find((workspace) => workspace.slug === workspaceSlug) ?? MOCK_WORKSPACES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="max-w-56 justify-between">
            <span className="flex min-w-0 items-center gap-2">
              <Building2 className="text-muted-foreground shrink-0" />
              <span className="truncate">{active.name}</span>
            </span>
            <ChevronsUpDown className="text-muted-foreground shrink-0" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {MOCK_WORKSPACES.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => router.push(`/${workspace.slug}/dashboard`)}
          >
            <Building2 className="text-muted-foreground" />
            <span className="flex-1 truncate">{workspace.name}</span>
            <Badge
              variant={workspace.plan === "pro" ? "default" : "secondary"}
              className="uppercase"
            >
              {workspace.plan}
            </Badge>
            <Check className={cn("size-4", workspace.slug !== active.slug && "opacity-0")} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { WorkspaceSwitcher };
