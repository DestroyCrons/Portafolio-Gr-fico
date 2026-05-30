import type { HomeContent } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";

export function Playground({ content }: { content: HomeContent["playground"] }) {
  return (
    <section id="playground" className="px-5 py-24 md:px-10 lg:px-16">
      <div className="glass-panel noise-border overflow-hidden rounded-[8px] p-6 md:p-10">
        <Badge>Playground</Badge>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <h2 className="font-display text-6xl uppercase leading-[0.88] text-chrome md:text-9xl">
            {content.title}
          </h2>
          <div>
            <p className="text-lg leading-8 text-white/76">{content.body}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["shader", "poster", "motion"].map((item) => (
                <div
                  key={item}
                  className="aspect-square rounded-[8px] border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(0,231,255,0.36),transparent_42%),linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,47,85,0.12))] p-3 font-display text-xs uppercase text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

