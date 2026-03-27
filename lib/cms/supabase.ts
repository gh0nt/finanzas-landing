import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabasePublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
}

export function getSupabaseWriteClient() {
  const url = getSupabaseUrl();
  const publicKey = getSupabasePublicKey();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const writeKey = serviceRoleKey ?? publicKey;

  if (!url || !writeKey) {
    return null;
  }

  return createClient(url, writeKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseReadClient() {
  const url = getSupabaseUrl();
  const publicKey = getSupabasePublicKey();

  if (!url || !publicKey) {
    return null;
  }

  return createClient(url, publicKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseConfigInfo() {
  return {
    hasUrl: Boolean(getSupabaseUrl()),
    hasPublicKey: Boolean(getSupabasePublicKey()),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}
