import { resend } from "@/lib/resend/client";

export async function sendWorkspaceInviteEmail(params: {
  to: string;
  workspaceName: string;
  inviterName: string;
  acceptUrl: string;
}) {
  const { to, workspaceName, inviterName, acceptUrl } = params;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `${inviterName} convidou você para o workspace ${workspaceName} no PipeFlow`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
        <h2 style="color: #2563eb; margin-bottom: 4px;">PipeFlow CRM</h2>
        <p><strong>${inviterName}</strong> convidou você para colaborar no workspace <strong>${workspaceName}</strong>.</p>
        <p style="margin: 24px 0;">
          <a
            href="${acceptUrl}"
            style="display:inline-block; background:#2563eb; color:#ffffff; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:600;"
          >
            Aceitar convite
          </a>
        </p>
        <p style="color:#64748b; font-size:12px;">
          Este convite expira em 7 dias. Se você não esperava este e-mail, pode ignorá-lo.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
