"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  { href: "members", label: "Membros" },
  { href: "billing", label: "Billing" },
] as const;

function SettingsNav({ workspaceSlug }: { workspaceSlug: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b">
      {SETTINGS_TABS.map((tab) => {
        const href = `/${workspaceSlug}/settings/${tab.href}`;
        const isActive = pathname?.startsWith(href);

        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { SettingsNav };
