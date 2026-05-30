import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ ok: true });

  const body = (await request.json().catch(() => ({}))) as {
    path?: string;
    referrer?: string;
  };
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipHash = forwardedFor
    ? createHash("sha256").update(forwardedFor).digest("hex")
    : null;

  await supabase.from("page_views").insert({
    path: body.path ?? "/",
    referrer: body.referrer ?? null,
    user_agent: headerStore.get("user-agent"),
    ip_hash: ipHash
  });

  return NextResponse.json({ ok: true });
}
