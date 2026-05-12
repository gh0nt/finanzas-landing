const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

console.log(`Supabase URL configured: ${hasSupabaseUrl ? "yes" : "no"}`);
console.log(
  `Service role key configured: ${hasServiceRoleKey ? "yes" : "no"}`,
);
