import type { AuthError } from "@supabase/supabase-js";

const MESSAGES_BY_CODE: Record<string, string> = {
  over_email_send_rate_limit:
    "Limite de e-mails do projeto atingido. Aguarde alguns minutos e tente novamente.",
  user_already_exists: "Este e-mail já está cadastrado. Tente entrar na sua conta.",
  email_exists: "Este e-mail já está cadastrado. Tente entrar na sua conta.",
  weak_password: "Escolha uma senha mais forte (mínimo 8 caracteres).",
  email_address_invalid: "Informe um e-mail válido.",
  signup_disabled: "Novos cadastros estão temporariamente desativados.",
  over_request_rate_limit: "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.",
};

export function friendlyAuthErrorMessage(error: AuthError): string {
  return (
    MESSAGES_BY_CODE[error.code ?? ""] ??
    "Não foi possível concluir o cadastro. Tente novamente em instantes."
  );
}
