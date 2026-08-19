import { z } from "zod";

import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

const LEAD_STATUS_IDS = LEAD_STATUSES.map((status) => status.id) as [LeadStatus, ...LeadStatus[]];

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome completo"),
  email: z.string().trim().email("Informe um e-mail válido"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  company: z.string().trim().min(1, "Informe a empresa"),
  roleTitle: z.string().trim().min(1, "Informe o cargo"),
  status: z.enum(LEAD_STATUS_IDS),
  assignedTo: z.string().min(1, "Selecione um responsável"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const leadFormDefaultValues: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  roleTitle: "",
  status: "novo",
  assignedTo: "",
};
