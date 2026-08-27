import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

// Service-role client: bypasses RLS entirely, no cookies/user session. Only
// for server-side code with no request-scoped user context — the Stripe
// webhook route, which runs outside any logged-in user's session, is the one
// caller today.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
