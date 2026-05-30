import { SiteExperience } from "@/components/site/SiteExperience";
import { GlassPanel } from "@/components/ui/glass-panel";
import { getAdminProjects, getDraftHome } from "@/lib/cms/queries";

export default async function AdminPreviewPage() {
  const [home, projects] = await Promise.all([getDraftHome(), getAdminProjects()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase text-cyan">Draft Preview</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
          Live Composition
        </h1>
      </div>
      <GlassPanel className="overflow-hidden p-2">
        <div className="h-[78vh] overflow-auto rounded-[8px] border border-white/10 bg-black">
          <SiteExperience
            experience={{
              home,
              projects
            }}
          />
        </div>
      </GlassPanel>
    </div>
  );
}

