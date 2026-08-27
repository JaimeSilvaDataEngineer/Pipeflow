"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { createLead } from "@/app/(dashboard)/[workspace]/leads/actions";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsToolbar, type DateRangeFilter } from "@/components/leads/leads-toolbar";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { LeadFormValues } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

const SEARCH_DEBOUNCE_MS = 300;

function LeadsExplorer({
  leads,
  members,
  workspaceSlug,
}: {
  leads: Lead[];
  members: WorkspaceMember[];
  workspaceSlug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const assignee = searchParams.get("assignedTo") ?? "all";
  const dateRange = (searchParams.get("dateRange") as DateRangeFilter) ?? "all";

  const [searchInput, setSearchInput] = React.useState(search);

  function pushParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== search) {
        pushParams({ search: searchInput });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  async function handleCreate(values: LeadFormValues) {
    await createLead(workspaceSlug, values);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <LeadsToolbar
        search={searchInput}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={(value) => pushParams({ status: value })}
        assignee={assignee}
        onAssigneeChange={(value) => pushParams({ assignedTo: value })}
        dateRange={dateRange}
        onDateRangeChange={(value) => pushParams({ dateRange: value })}
        members={members}
        onCreate={handleCreate}
      />
      <LeadsTable leads={leads} members={members} workspaceSlug={workspaceSlug} />
    </div>
  );
}

export { LeadsExplorer };
