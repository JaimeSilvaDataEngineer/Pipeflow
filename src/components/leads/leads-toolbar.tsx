"use client";

import { PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadFormSheet } from "@/components/leads/lead-form-sheet";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { LeadFormValues } from "@/lib/validations/lead";
import { LEAD_STATUSES } from "@/types/lead";

export type DateRangeFilter = "all" | "7d" | "30d";

const DATE_RANGE_OPTIONS: { id: DateRangeFilter; label: string }[] = [
  { id: "all", label: "Qualquer data" },
  { id: "7d", label: "Últimos 7 dias" },
  { id: "30d", label: "Últimos 30 dias" },
];

const STATUS_LABELS: Record<string, string> = {
  all: "Todos os status",
  ...Object.fromEntries(LEAD_STATUSES.map((item) => [item.id, item.label])),
};

const DATE_RANGE_LABELS: Record<string, string> = Object.fromEntries(
  DATE_RANGE_OPTIONS.map((option) => [option.id, option.label]),
);

function LeadsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  assignee,
  onAssigneeChange,
  dateRange,
  onDateRangeChange,
  members,
  onCreate,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  assignee: string;
  onAssigneeChange: (value: string) => void;
  dateRange: DateRangeFilter;
  onDateRangeChange: (value: DateRangeFilter) => void;
  members: WorkspaceMember[];
  onCreate: (values: LeadFormValues) => Promise<void>;
}) {
  const assigneeLabels: Record<string, string> = {
    all: "Todos os responsáveis",
    ...Object.fromEntries(members.map((member) => [member.id, member.name])),
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nome, e-mail ou empresa"
            className="pl-8"
          />
        </div>

        <Select value={status} onValueChange={(value) => onStatusChange(value ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue>{(value: string) => STATUS_LABELS[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {LEAD_STATUSES.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assignee} onValueChange={(value) => onAssigneeChange(value ?? "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue>{(value: string) => assigneeLabels[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os responsáveis</SelectItem>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={dateRange}
          onValueChange={(value) => value && onDateRangeChange(value as DateRangeFilter)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue>{(value: string) => DATE_RANGE_LABELS[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <LeadFormSheet
        onSubmit={onCreate}
        members={members}
        trigger={
          <Button>
            <PlusIcon />
            Novo lead
          </Button>
        }
      />
    </div>
  );
}

export { LeadsToolbar, DATE_RANGE_OPTIONS };
