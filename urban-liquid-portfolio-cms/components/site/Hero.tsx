"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import type { HomeContent } from "@/lib/cms/types";
import { LiquidGlassStage } from "@/components/site/LiquidGlassStage";

type HeroProps = {
  content: HomeContent["hero"];
};

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden px-5 pb-16 pt-32 md:px-10 lg:px-16">
      <LiquidGlassStage />
      <div className="absolute left-5 top-24 hidden max-w-sm rotate-[-4deg] border border-acid/50 bg-acid px-4 py-2 font-display text-xl uppercase text-black shadow-glow md:block">
        {content.marquee[0] ?? "liquid glass"}
      </div>
      <div className="relative z-10 grid w-full gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-sm uppercase text-cyan"
          >
            {content.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: "blur(18px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-6 max-w-6xl font-display text-[clamp(4.4rem,15vw,14rem)] uppercase leading-[0.85] text-chrome pt-2 pb-1"
          >
            {content.headline}
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36 }}
          className="glass-panel noise-border rounded-[8px] p-5"
        >
          <p className="text-base leading-7 text-white/76">{content.subheadline}</p>
          <a
            href="#selected-work"
            className="focus-ring mt-8 inline-flex h-12 items-center gap-2 rounded-[8px] border border-white/15 bg-white/10 px-5 text-sm font-semibold uppercase text-white transition hover:border-acid hover:text-acid"
          >
            {content.ctaLabel}
            <ArrowDownRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 overflow-hidden border-y border-white/10 bg-black/30 py-3 backdrop-blur">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="flex min-w-max gap-8 font-display text-2xl uppercase text-white/54"
        >
          {[...content.marquee, ...content.marquee, ...content.marquee].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
