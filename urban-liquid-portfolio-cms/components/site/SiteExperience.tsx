"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortfolioExperience, SectionKey } from "@/lib/cms/types";
import { About } from "@/components/site/About";
import { AnalyticsBeacon } from "@/components/site/AnalyticsBeacon";
import { Contact } from "@/components/site/Contact";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Hero } from "@/components/site/Hero";
import { Playground } from "@/components/site/Playground";
import { Process } from "@/components/site/Process";
import { SelectedWork } from "@/components/site/SelectedWork";
import { Skills } from "@/components/site/Skills";
import { SmoothScroll } from "@/components/site/SmoothScroll";

type SiteExperienceProps = {
  experience: PortfolioExperience;
};

export function SiteExperience({ experience }: SiteExperienceProps) {
  useEffect(() => {
    if (!experience.home.motion.enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 42, filter: "blur(14px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });
    });

    return () => context.revert();
  }, [experience.home.motion.enabled]);

  const renderSection = (id: SectionKey) => {
    switch (id) {
      case "hero":
        return <Hero key={id} content={experience.home.hero} />;
      case "about":
        return (
          <div key={id} data-reveal>
            <About content={experience.home.about} />
          </div>
        );
      case "selectedWork":
        return (
          <div key={id} data-reveal>
            <SelectedWork
              projects={experience.projects}
              imageQuality={experience.home.performance.imageQuality}
            />
          </div>
        );
      case "process":
        return (
          <div key={id} data-reveal>
            <Process content={experience.home.process} />
          </div>
        );
      case "playground":
        return (
          <div key={id} data-reveal>
            <Playground content={experience.home.playground} />
          </div>
        );
      case "skills":
        return (
          <div key={id} data-reveal>
            <Skills skills={experience.home.skills} />
          </div>
        );
      case "contact":
        return (
          <div key={id} data-reveal>
            <Contact contact={experience.home.contact} />
          </div>
        );
      default:
        return null;
    }
  };

  const sections = [...experience.home.sections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.position - b.position);

  return (
    <SmoothScroll enabled={experience.home.motion.enabled}>
      <AnalyticsBeacon enabled={experience.home.performance.analyticsEnabled} />
      <CustomCursor />
      <main className="relative overflow-hidden">{sections.map((section) => renderSection(section.id))}</main>
    </SmoothScroll>
  );
}
