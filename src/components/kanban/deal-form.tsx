import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PIPELINE_STAGES } from "@/lib/constants/pipeline";
import { MOCK_LEADS } from "@/lib/mock/leads";
import { MOCK_MEMBERS } from "@/lib/mock/members";
import type { DealFormValues } from "@/lib/validations/deal";

type DealFormErrors = Partial<Record<keyof DealFormValues, string>>;

function DealForm({
  values,
  errors,
  onChange,
}: {
  values: DealFormValues;
  errors: DealFormErrors;
  onChange: <K extends keyof DealFormValues>(field: K, value: DealFormValues[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deal-title">Título</Label>
        <Input
          id="deal-title"
          value={values.title}
          onChange={(event) => onChange("title", event.target.value)}
          aria-invalid={Boolean(errors.title)}
          placeholder="Ex: Licença anual — Empresa X"
        />
        {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deal-value">Valor (R$)</Label>
          <Input
            id="deal-value"
            type="number"
            min={0}
            step="0.01"
            value={values.valueReais || ""}
            onChange={(event) => onChange("valueReais", event.target.valueAsNumber)}
            aria-invalid={Boolean(errors.valueReais)}
            placeholder="0,00"
          />
          {errors.valueReais && <p className="text-destructive text-xs">{errors.valueReais}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deal-due-date">Prazo</Label>
          <Input
            id="deal-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) => onChange("dueDate", event.target.value)}
            aria-invalid={Boolean(errors.dueDate)}
          />
          {errors.dueDate && <p className="text-destructive text-xs">{errors.dueDate}</p>}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="deal-lead">Lead vinculado</Label>
          <Select value={values.leadId} onValueChange={(value) => onChange("leadId", value ?? "")}>
            <SelectTrigger id="deal-lead" className="w-full">
              <SelectValue placeholder="Selecione">
                {(value: string) => MOCK_LEADS.find((lead) => lead.id === value)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MOCK_LEADS.map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.name} — {lead.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.leadId && <p className="text-destructive text-xs">{errors.leadId}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deal-assignee">Responsável</Label>
          <Select
            value={values.assignedTo}
            onValueChange={(value) => onChange("assignedTo", value ?? "")}
          >
            <SelectTrigger id="deal-assignee" className="w-full">
              <SelectValue placeholder="Selecione">
                {(value: string) => MOCK_MEMBERS.find((member) => member.id === value)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MOCK_MEMBERS.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assignedTo && <p className="text-destructive text-xs">{errors.assignedTo}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deal-stage">Etapa</Label>
          <Select
            value={values.stageId}
            onValueChange={(value) => value && onChange("stageId", value as DealFormValues["stageId"])}
          >
            <SelectTrigger id="deal-stage" className="w-full">
              <SelectValue>
                {(value: string) => PIPELINE_STAGES.find((stage) => stage.id === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PIPELINE_STAGES.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export { DealForm };
export type { DealFormErrors };
