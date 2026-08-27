import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";
import type { Lead, LeadStatus } from "@/types/lead";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export function mapLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    company: row.company ?? "",
    roleTitle: row.role_title ?? "",
    status: row.status as LeadStatus,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
  };
}

export type LeadFilters = {
  search?: string;
  status?: LeadStatus | "all";
  assignedTo?: string | "all";
  dateRangeDays?: number | null;
};

// PostgREST's `.or()` filter string uses `,` and `(` `)` as grammar and `%`/`_`
// as ILIKE wildcards — a raw search term containing any of those (e.g. "Grupo
// (SP)") would otherwise break the filter syntax or match unintended rows.
// Escaping the wildcards and wrapping the value in double quotes (PostgREST's
// documented way to embed reserved characters in a filter value) neutralizes
// both.
function escapeIlikeTerm(term: string): string {
  return term.replace(/[%_\\]/g, (char) => `\\${char}`).replace(/"/g, '\\"');
}

export async function getLeads(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  filters: LeadFilters = {},
): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (filters.search) {
    const term = filters.search.trim();
    if (term.length > 0) {
      const escaped = escapeIlikeTerm(term);
      query = query.or(
        `name.ilike."%${escaped}%",email.ilike."%${escaped}%",company.ilike."%${escaped}%"`,
      );
    }
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.assignedTo && filters.assignedTo !== "all") {
    query = query.eq("assigned_to", filters.assignedTo);
  }

  if (filters.dateRangeDays) {
    const since = new Date(Date.now() - filters.dateRangeDays * 24 * 60 * 60 * 1000);
    query = query.gte("created_at", since.toISOString());
  }

  const { data, error } = await query;

  if (error || !data) {
    if (error) console.error("getLeads failed:", error.message);
    return [];
  }

  return data.map(mapLeadRow);
}

export async function getLeadsByIds(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  ids: string[],
): Promise<Lead[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .in("id", ids);

  if (error || !data) {
    if (error) console.error("getLeadsByIds failed:", error.message);
    return [];
  }

  return data.map(mapLeadRow);
}

export async function getLeadById(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  id: string,
): Promise<Lead | null> {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", id)
    .maybeSingle();

  return data ? mapLeadRow(data) : null;
}
