"use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicSupabaseEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  if (!publicSupabaseEnv.url || !publicSupabaseEnv.anonKey) return null;

  return createBrowserClient(publicSupabaseEnv.url, publicSupabaseEnv.anonKey);
}
