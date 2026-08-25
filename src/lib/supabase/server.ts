import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// TODO(M6b): parameterize with the generated `Database` type once
// src/types/database.ts exists.
async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component with no `setAll` support —
            // safe to ignore as long as middleware refreshes the session.
          }
        },
      },
    },
  );
}

export { createClient };
