import type { SupabaseClient } from "@supabase/supabase-js";

type VersionInput = {
  entityType: "project" | "home" | "settings";
  entityId: string;
  data: unknown;
  userId: string;
};

export async function recordContentVersion(
  supabase: SupabaseClient,
  { entityType, entityId, data, userId }: VersionInput
) {
  await supabase.from("content_versions").insert({
    entity_type: entityType,
    entity_id: entityId,
    snapshot: data,
    created_by: userId
  });
}

