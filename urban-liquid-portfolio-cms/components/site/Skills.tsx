import { Badge } from "@/components/ui/badge";

export function Skills({ skills }: { skills: string[] }) {
  return (
    <section id="skills" className="px-5 py-24 md:px-10 lg:px-16">
      <Badge>Skills</Badge>
      <div className="mt-8 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-[8px] border border-white/12 bg-white/8 px-5 py-4 font-display text-2xl uppercase text-white transition hover:border-acid hover:text-acid md:text-4xl"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

