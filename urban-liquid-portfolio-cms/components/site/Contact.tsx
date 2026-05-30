import { ArrowUpRight } from "lucide-react";
import type { HomeContent } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";

export function Contact({ contact }: { contact: HomeContent["contact"] }) {
  return (
    <section id="contact" className="px-5 pb-8 pt-24 md:px-10 lg:px-16">
      <div className="glass-panel grid gap-8 rounded-[8px] p-6 md:p-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Badge>Contact</Badge>
          <h2 className="mt-6 font-display text-6xl uppercase leading-[0.9] text-white md:text-8xl">
            Build the next signal.
          </h2>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm uppercase text-white/48">{contact.availability}</p>
            <a
              href={`mailto:${contact.email}`}
              className="focus-ring mt-3 inline-flex items-center gap-3 font-display text-4xl uppercase text-chrome md:text-5xl"
            >
              {contact.email}
              <ArrowUpRight className="h-7 w-7" />
            </a>
            <p className="mt-5 text-sm uppercase text-white/52">{contact.city}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded-full border border-white/12 px-4 py-2 text-xs font-semibold uppercase text-white/62 transition hover:border-cyan hover:text-cyan"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <footer className="flex flex-col gap-3 py-8 text-xs uppercase text-white/38 md:flex-row md:items-center md:justify-between">
        <p>Urban Liquid Portfolio</p>
        <p>Built for moving culture</p>
      </footer>
    </section>
  );
}
