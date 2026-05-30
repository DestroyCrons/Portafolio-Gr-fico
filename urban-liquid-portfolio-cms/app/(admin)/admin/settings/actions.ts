"use server";

import { publishHomeAction, saveHomeDraftAction } from "@/app/(admin)/admin/homepage/actions";
import type { HomeInput } from "@/lib/cms/schemas";

export async function saveSettingsAction(input: HomeInput) {
  return saveHomeDraftAction(input);
}

export async function publishSettingsAction(input: HomeInput) {
  return publishHomeAction(input);
}

