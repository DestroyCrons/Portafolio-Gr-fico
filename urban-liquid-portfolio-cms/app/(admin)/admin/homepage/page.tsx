import { HomeEditor } from "@/components/admin/HomeEditor";
import { getAdminProjects, getDraftHome } from "@/lib/cms/queries";

export default async function AdminHomepagePage() {
  const [home, projects] = await Promise.all([getDraftHome(), getAdminProjects()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase text-cyan">CMS Builder</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
          Homepage
        </h1>
      </div>
      <HomeEditor initialHome={home} projects={projects} />
    </div>
  );
}

