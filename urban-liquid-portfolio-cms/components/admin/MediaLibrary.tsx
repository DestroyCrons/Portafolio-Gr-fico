"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { deleteMediaAction } from "@/app/(admin)/admin/media/actions";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input, Label, Select } from "@/components/ui/field";
import type { MediaAsset } from "@/lib/cms/types";

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [folder, setFolder] = useState("library");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    const uploaded: MediaAsset[] = [];

    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      body.append("tags", tags);

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body
      });

      if (!response.ok) {
        toast.error(`${file.name} failed.`);
        continue;
      }

      uploaded.push((await response.json()) as MediaAsset);
    }

    setAssets((current) => [...uploaded, ...current]);
    setUploading(false);
    if (uploaded.length) toast.success(`${uploaded.length} asset uploaded.`);
  }

  function removeAsset(asset: MediaAsset) {
    startTransition(async () => {
      await deleteMediaAction(asset.id, asset.storagePath);
      setAssets((current) => current.filter((item) => item.id !== asset.id));
      toast.success("Asset deleted.");
    });
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
      <GlassPanel className="p-5">
        <p className="font-display text-3xl uppercase text-white">Upload</p>
        <div className="mt-5 grid gap-5">
          <div>
            <Label htmlFor="folder">Folder</Label>
            <Select id="folder" value={folder} onChange={(event) => setFolder(event.target.value)}>
              <option value="library">library</option>
              <option value="projects">projects</option>
              <option value="homepage">homepage</option>
              <option value="playground">playground</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" value={tags} onChange={(event) => setTags(event.target.value)} />
          </div>
          <label className="focus-ring flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-cyan/36 bg-cyan/8 p-6 text-center transition hover:border-acid hover:bg-acid/8">
            <Upload className="h-8 w-8 text-cyan" />
            <span className="mt-4 text-sm font-semibold uppercase text-white">
              {uploading ? "Uploading" : "Drop media here"}
            </span>
            <span className="mt-2 text-xs uppercase text-white/42">Images become WebP automatically</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="sr-only"
              onChange={(event) => void uploadFiles(event.target.files)}
            />
          </label>
        </div>
      </GlassPanel>

      <GlassPanel className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="font-display text-3xl uppercase text-white">Library</p>
          <p className="text-xs uppercase text-white/42">{assets.length} assets</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-[8px] border border-white/10 bg-white/6">
              <div className="relative aspect-[4/3] bg-black">
                {asset.type === "image" ? (
                  <Image src={asset.url} alt={asset.alt} fill sizes="33vw" className="object-cover" />
                ) : (
                  <video src={asset.url} className="h-full w-full object-cover" muted controls />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm text-white/72">{asset.alt || "Untitled asset"}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="ghost"
                    className="h-9 flex-1"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={() => void copyUrl(asset.url)}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="danger"
                    className="h-9"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => removeAsset(asset)}
                    disabled={isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

