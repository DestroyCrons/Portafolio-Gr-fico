"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { homeSchema, type HomeInput } from "@/lib/cms/schemas";
import { recordContentVersion } from "@/lib/cms/versioning";

async function upsertHome(status: "draft" | "published", input: HomeInput) {
  const { supabase, user } = await requireAdmin();
  const value = homeSchema.parse(input);
  const payload = {
    key: "home",
    status,
    value,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
    published_at: status === "published" ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "key,status" })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await recordContentVersion(supabase, {
    entityType: "home",
    entityId: data.id,
    data: value,
    userId: user.id
  });

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return value;
}

export async function saveHomeDraftAction(input: HomeInput) {
  return upsertHome("draft", input);
}

export async function publishHomeAction(input: HomeInput) {
  await upsertHome("draft", input);
  return upsertHome("published", input);
}

