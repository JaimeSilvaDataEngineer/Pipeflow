import { createBrowserClient } from "@supabase/ssr";

// TODO(M6b): parameterize with the generated `Database` type once
// src/types/database.ts exists.
let client: ReturnType<typeof createBrowserClient> | undefined;

function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return client;
}

export { createClient };
