export const LEAD_STATUSES = [
  { id: "novo", label: "Novo", color: "gray" as const },
  { id: "contatado", label: "Contatado", color: "blue" as const },
  { id: "qualificado", label: "Qualificado", color: "amber" as const },
  { id: "convertido", label: "Convertido", color: "green" as const },
  { id: "desqualificado", label: "Desqualificado", color: "red" as const },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["id"];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  roleTitle: string;
  status: LeadStatus;
  assignedTo: string | null;
  createdAt: string;
};
