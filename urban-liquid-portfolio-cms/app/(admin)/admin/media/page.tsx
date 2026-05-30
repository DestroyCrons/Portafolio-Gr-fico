import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getMediaAssets } from "@/lib/cms/queries";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase text-cyan">Assets</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
          Media Library
        </h1>
      </div>
      <MediaLibrary initialAssets={assets} />
    </div>
  );
}

