import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { LeadFormValues } from "@/lib/validations/lead";
import { LEAD_STATUSES } from "@/types/lead";

type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;

function LeadForm({
  values,
  errors,
  members,
  onChange,
}: {
  values: LeadFormValues;
  errors: LeadFormErrors;
  members: WorkspaceMember[];
  onChange: <K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="lead-name">Nome</Label>
          <Input
            id="lead-name"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            placeholder="Nome completo"
          />
          {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-email">E-mail</Label>
          <Input
            id="lead-email"
            type="email"
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            placeholder="nome@empresa.com"
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-phone">Telefone</Label>
          <Input
            id="lead-phone"
            value={values.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            placeholder="(11) 90000-0000"
          />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-company">Empresa</Label>
          <Input
            id="lead-company"
            value={values.company}
            onChange={(event) => onChange("company", event.target.value)}
            aria-invalid={Boolean(errors.company)}
            placeholder="Nome da empresa"
          />
          {errors.company && <p className="text-destructive text-xs">{errors.company}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-role">Cargo</Label>
          <Input
            id="lead-role"
            value={values.roleTitle}
            onChange={(event) => onChange("roleTitle", event.target.value)}
            aria-invalid={Boolean(errors.roleTitle)}
            placeholder="Cargo do contato"
          />
          {errors.roleTitle && <p className="text-destructive text-xs">{errors.roleTitle}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-status">Status</Label>
          <Select
            value={values.status}
            onValueChange={(value) =>
              value && onChange("status", value as LeadFormValues["status"])
            }
          >
            <SelectTrigger id="lead-status" className="w-full">
              <SelectValue>
                {(value: string) => LEAD_STATUSES.find((item) => item.id === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-assignee">Responsável</Label>
          <Select
            value={values.assignedTo}
            onValueChange={(value) => onChange("assignedTo", value ?? "")}
          >
            <SelectTrigger id="lead-assignee" className="w-full">
              <SelectValue placeholder="Selecione">
                {(value: string) => members.find((member) => member.id === value)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assignedTo && <p className="text-destructive text-xs">{errors.assignedTo}</p>}
        </div>
      </div>
    </div>
  );
}

export { LeadForm };
export type { LeadFormErrors };
