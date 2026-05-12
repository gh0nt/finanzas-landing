import "server-only";

import { createClient } from "@supabase/supabase-js";

// Server-only admin client for CMS writes. Never import this from client
// components and never expose SUPABASE_SERVICE_ROLE_KEY with NEXT_PUBLIC_.
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. CMS write operations require the server-only service role key because RLS is enabled.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
