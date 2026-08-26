import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Exchanges the confirmation/magic-link code Supabase Auth appends to
// `emailRedirectTo` for a real session, then hands off to onboarding (which
// redirects further to the user's workspace if they already have one).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Não foi possível confirmar seu e-mail. Tente entrar novamente.")}`,
  );
}
