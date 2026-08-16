"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

function MobileSidebar({ workspaceSlug }: { workspaceSlug: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon />
            <span className="sr-only">Abrir menu</span>
          </Button>
        }
      />
      <SheetContent side="left">
        <div className="flex h-14 items-center px-4">
          <SheetTitle>PipeFlow</SheetTitle>
        </div>
        <SidebarNav workspaceSlug={workspaceSlug} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export { MobileSidebar };
