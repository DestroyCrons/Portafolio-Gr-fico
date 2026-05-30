"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { projectSchema, type ProjectInput } from "@/lib/cms/schemas";
import { recordContentVersion } from "@/lib/cms/versioning";
import { slugify } from "@/lib/utils";

export async function saveProjectAction(input: ProjectInput) {
  const { supabase, user } = await requireAdmin();
  const parsed = projectSchema.parse({
    ...input,
    slug: input.slug ? slugify(input.slug) : slugify(input.title)
  });

  const id = parsed.id ?? crypto.randomUUID();
  const payload = {
    id,
    slug: parsed.slug,
    title: parsed.title,
    eyebrow: parsed.eyebrow,
    summary: parsed.summary,
    description: parsed.description,
    category: parsed.category,
    tags: parsed.tags,
    cover_url: parsed.coverUrl || null,
    video_url: parsed.videoUrl || null,
    external_url: parsed.externalUrl || null,
    featured: parsed.featured,
    visible: parsed.visible,
    status: parsed.status,
    position: parsed.position,
    layout: parsed.layout,
    media: parsed.media,
    created_by: user.id,
    updated_by: user.id,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("projects").upsert(payload, { onConflict: "id" });
  if (error) throw new Error(error.message);

  await recordContentVersion(supabase, {
    entityType: "project",
    entityId: id,
    data: payload,
    userId: user.id
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { id };
}

export async function deleteProjectAction(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function reorderProjectsAction(items: Array<{ id: string; position: number }>) {
  const { supabase } = await requireAdmin();

  const updates = items.map((item) =>
    supabase.from("projects").update({ position: item.position }).eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const error = results.find((result) => result.error)?.error;
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function toggleProjectVisibilityAction(id: string, visible: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("projects")
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function publishProjectAction(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("projects")
    .update({ status: "published", visible: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

