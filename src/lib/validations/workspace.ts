import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do workspace").max(80, "Nome muito longo"),
});

export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;
