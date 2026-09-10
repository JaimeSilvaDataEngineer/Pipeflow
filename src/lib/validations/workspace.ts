import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do workspace").max(80, "Nome muito longo"),
});

export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do workspace").max(80, "Nome muito longo"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Informe o identificador do workspace")
    .max(60, "Identificador muito longo")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
});

export type UpdateWorkspaceValues = z.infer<typeof updateWorkspaceSchema>;
