import type { HomeContent } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";

export function Process({ content }: { content: HomeContent["process"] }) {
  return (
    <section id="process" className="px-5 py-24 md:px-10 lg:px-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge>Process</Badge>
          <h2 className="mt-5 font-display text-5xl uppercase leading-[0.94] text-white md:text-7xl">
            {content.title}
          </h2>
        </div>
        <div className="grid gap-4">
          {content.steps.map((step, index) => (
            <div key={step.title} className="glass-panel rounded-[8px] p-6">
              <p className="font-display text-sm uppercase text-cyan">0{index + 1}</p>
              <h3 className="mt-3 font-display text-3xl uppercase text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/66">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

