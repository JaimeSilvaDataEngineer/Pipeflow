"use client";

import * as React from "react";

import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsToolbar, type DateRangeFilter } from "@/components/leads/leads-toolbar";
import type { LeadFormValues } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

const DATE_RANGE_DAYS: Record<DateRangeFilter, number | null> = {
  all: null,
  "7d": 7,
  "30d": 30,
};

function matchesDateRange(createdAt: string, range: DateRangeFilter, now: number) {
  const days = DATE_RANGE_DAYS[range];
  if (days === null) return true;

  const createdAtMs = new Date(createdAt).getTime();
  const rangeStartMs = now - days * 24 * 60 * 60 * 1000;
  return createdAtMs >= rangeStartMs;
}

function LeadsExplorer({
  initialLeads,
  workspaceSlug,
}: {
  initialLeads: Lead[];
  workspaceSlug: string;
}) {
  const [leads, setLeads] = React.useState(initialLeads);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [assignee, setAssignee] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRangeFilter>("all");

  const filteredLeads = React.useMemo(() => {
    const now = Date.now();
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesQuery =
        query.length === 0 ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query);

      const matchesStatus = status === "all" || lead.status === status;
      const matchesAssignee = assignee === "all" || lead.assignedTo === assignee;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesAssignee &&
        matchesDateRange(lead.createdAt, dateRange, now)
      );
    });
  }, [leads, search, status, assignee, dateRange]);

  function handleCreate(values: LeadFormValues) {
    const newLead: Lead = {
      id: `lead_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      ...values,
    };
    setLeads((current) => [newLead, ...current]);
  }

  return (
    <div className="flex flex-col gap-4">
      <LeadsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        assignee={assignee}
        onAssigneeChange={setAssignee}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onCreate={handleCreate}
      />
      <LeadsTable leads={filteredLeads} workspaceSlug={workspaceSlug} />
    </div>
  );
}

export { LeadsExplorer };
