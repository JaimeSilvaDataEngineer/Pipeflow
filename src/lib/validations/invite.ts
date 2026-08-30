import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido"),
  role: z.enum(["admin", "member"]),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;

export const inviteFormDefaultValues: InviteMemberValues = {
  email: "",
  role: "member",
};
