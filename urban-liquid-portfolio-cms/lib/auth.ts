import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminProfile } from "@/lib/cms/types";

export async function getAdminContext() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id,email,display_name,role")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as AdminProfile | null;

  if (profile?.role !== "admin") return null;

  return {
    supabase,
    user,
    profile
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context) {
    redirect("/admin/login");
  }

  return context;
}
