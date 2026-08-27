import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

// Handles the "Confirm signup" email link via token_hash + verifyOtp instead
// of the PKCE code-exchange pattern (/auth/callback, now removed). PKCE
// requires the code_verifier cookie set in the browser that started signUp()
// to still be present when the link is opened — which breaks whenever the
// link is opened on a different device/browser, or pre-fetched by the email
// provider's own link-scanning bots (Gmail does this by default), consuming
// the one-time code before the user ever clicks it. verifyOtp has no such
// dependency: the token_hash alone is enough, from any browser.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/onboarding";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Não foi possível confirmar seu e-mail. Tente entrar novamente.")}`,
  );
}
