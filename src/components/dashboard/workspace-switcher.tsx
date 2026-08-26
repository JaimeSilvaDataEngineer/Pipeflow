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
import type { WorkspaceSummary } from "@/types/workspace";

function WorkspaceSwitcher({
  workspaces,
  activeSlug,
}: {
  workspaces: WorkspaceSummary[];
  activeSlug: string;
}) {
  const router = useRouter();
  const active = workspaces.find((workspace) => workspace.slug === activeSlug) ?? workspaces[0];

  if (!active) {
    return null;
  }

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
        {workspaces.map((workspace) => (
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
