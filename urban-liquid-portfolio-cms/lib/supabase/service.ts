import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

export function createServiceClient() {
  if (!supabaseEnv.url || !supabaseEnv.serviceRoleKey) return null;

  return createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

