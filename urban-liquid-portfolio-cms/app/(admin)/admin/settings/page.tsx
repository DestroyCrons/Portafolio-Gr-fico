import { MotionSeoEditor } from "@/components/admin/MotionSeoEditor";
import { getDraftHome } from "@/lib/cms/queries";

export default async function AdminSettingsPage() {
  const home = await getDraftHome();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase text-cyan">Studio Settings</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white md:text-7xl">
          Motion + SEO
        </h1>
      </div>
      <MotionSeoEditor initialHome={home} />
    </div>
  );
}

