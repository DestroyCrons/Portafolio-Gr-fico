import { ProjectManager } from "@/components/admin/ProjectManager";
import { getAdminProjects } from "@/lib/cms/queries";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase text-cyan">Portfolio CMS</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
          Project System
        </h1>
      </div>
      <ProjectManager initialProjects={projects} />
    </div>
  );
}

