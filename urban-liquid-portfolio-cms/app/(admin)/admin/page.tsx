import Link from "next/link";
import { BarChart3, Boxes, FileImage, PencilLine } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { getAdminStats } from "@/lib/cms/queries";
import { formatNumber } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm uppercase text-cyan">Dashboard</p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
            Control Room
          </h1>
        </div>
        <Link href="/admin/projects">
          <Button icon={<PencilLine className="h-4 w-4" />}>Edit Work</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={formatNumber(stats.projectCount)} icon={<Boxes className="h-4 w-4" />} />
        <StatCard label="Drafts" value={formatNumber(stats.draftCount)} icon={<PencilLine className="h-4 w-4" />} />
        <StatCard label="Media" value={formatNumber(stats.mediaCount)} icon={<FileImage className="h-4 w-4" />} />
        <StatCard label="Visitors" value={formatNumber(stats.pageViews)} icon={<BarChart3 className="h-4 w-4" />} />
      </div>
      <GlassPanel className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-display text-3xl uppercase text-chrome">Publishing Flow</p>
          <p className="mt-3 text-sm leading-7 text-white/62">
            Draft edits autosave, preview stays private, and publish writes a clean public version.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {["Edit", "Preview", "Publish"].map((step, index) => (
            <div key={step} className="rounded-[8px] border border-white/10 bg-white/6 p-4">
              <p className="font-display text-sm uppercase text-acid">0{index + 1}</p>
              <p className="mt-3 font-display text-2xl uppercase text-white">{step}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

