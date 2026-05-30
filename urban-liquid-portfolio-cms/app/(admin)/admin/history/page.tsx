import { History } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { getContentVersions } from "@/lib/cms/queries";

export default async function AdminHistoryPage() {
  const versions = await getContentVersions();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase text-cyan">Version History</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
          Timeline
        </h1>
      </div>
      <GlassPanel className="p-5">
        <div className="grid gap-3">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex flex-col gap-3 rounded-[8px] border border-white/10 bg-white/6 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-cyan/30 bg-cyan/10 text-cyan">
                  <History className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-2xl uppercase text-white">{version.entityType}</p>
                  <p className="text-xs uppercase text-white/42">{version.entityId}</p>
                </div>
              </div>
              <div className="text-left text-xs uppercase text-white/48 md:text-right">
                <p>{version.author}</p>
                <p>{new Date(version.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {!versions.length ? (
            <p className="rounded-[8px] border border-white/10 bg-white/6 p-5 text-sm text-white/54">
              No versions have been recorded yet.
            </p>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  );
}

