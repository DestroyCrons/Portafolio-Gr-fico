import type { HomeContent } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";

type AboutProps = {
  content: HomeContent["about"];
};

export function About({ content }: AboutProps) {
  return (
    <section id="about" className="px-5 py-24 md:px-10 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Badge>About</Badge>
          <h2 className="mt-5 max-w-2xl font-display text-5xl uppercase leading-[0.92] text-white md:text-7xl">
            {content.title}
          </h2>
        </div>
        <div className="glass-panel rounded-[8px] p-6 md:p-8">
          <p className="text-xl leading-9 text-white/78">{content.body}</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {content.stats.map((stat) => (
              <div key={stat.label} className="rounded-[8px] border border-white/10 bg-black/24 p-4">
                <p className="font-display text-4xl uppercase text-acid">{stat.value}</p>
                <p className="mt-2 text-xs uppercase text-white/48">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

