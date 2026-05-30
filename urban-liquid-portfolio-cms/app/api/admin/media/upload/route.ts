import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminContext } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "library").replace(/[^a-z0-9-]/gi, "-");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Unsupported media type" }, { status: 400 });
  }

  const source = Buffer.from(await file.arrayBuffer());
  const optimized = isImage
    ? await sharp(source)
        .rotate()
        .resize({ width: 2400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer()
    : source;

  const metadata = isImage ? await sharp(optimized).metadata() : {};
  const extension = isImage ? "webp" : file.name.split(".").pop() ?? "mp4";
  const mediaType = isImage ? "image" : "video";
  const path = `${folder}/${context.user.id}/${crypto.randomUUID()}.${extension}`;
  const contentType = isImage ? "image/webp" : file.type;

  const { error: uploadError } = await context.supabase.storage
    .from("portfolio-media")
    .upload(path, optimized, {
      contentType,
      upsert: false,
      cacheControl: "31536000"
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrl } = context.supabase.storage.from("portfolio-media").getPublicUrl(path);

  const { data: asset, error: insertError } = await context.supabase
    .from("media_assets")
    .insert({
      owner_id: context.user.id,
      type: mediaType,
      url: publicUrl.publicUrl,
      storage_path: path,
      alt: file.name.replace(/\.[^.]+$/, ""),
      mime_type: contentType,
      size_bytes: optimized.byteLength,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      tags,
      metadata: {
        originalName: file.name,
        optimized: isImage
      }
    })
    .select("id,type,url,alt,storage_path,width,height,tags")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: asset.id,
    type: asset.type,
    url: asset.url,
    alt: asset.alt,
    storagePath: asset.storage_path,
    width: asset.width,
    height: asset.height,
    tags: asset.tags ?? []
  });
}

