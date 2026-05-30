"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function deleteMediaAction(id: string, storagePath?: string) {
  const { supabase } = await requireAdmin();

  if (storagePath) {
    await supabase.storage.from("portfolio-media").remove([storagePath]);
  }

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
}

