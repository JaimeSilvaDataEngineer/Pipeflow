import { resend } from "@/lib/resend/client";

// inviterName and workspaceName are free-text fields a user controls (signup
// full name, workspace name) with no character restrictions — only escaping
// them keeps a crafted value (e.g. `</strong><a href=...>`) from injecting
// markup/links into an email that otherwise looks like a trusted PipeFlow
// notification to the invitee.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWorkspaceInviteEmail(params: {
  to: string;
  workspaceName: string;
  inviterName: string;
  acceptUrl: string;
}) {
  const { to, acceptUrl } = params;
  const workspaceName = escapeHtml(params.workspaceName);
  const inviterName = escapeHtml(params.inviterName);

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `${params.inviterName} convidou você para o workspace ${params.workspaceName} no PipeFlow`,
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
