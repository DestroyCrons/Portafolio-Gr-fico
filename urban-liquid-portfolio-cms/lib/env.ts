export const publicSupabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};

export const supabaseEnv = {
  ...publicSupabaseEnv,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

export function hasPublicSupabaseEnv() {
  return Boolean(publicSupabaseEnv.url && publicSupabaseEnv.anonKey);
}
