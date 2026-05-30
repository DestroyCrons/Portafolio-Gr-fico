import type { Metadata } from "next";
import { getPublishedExperience } from "@/lib/cms/queries";
import { SiteExperience } from "@/components/site/SiteExperience";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getPublishedExperience();

  return {
    title: home.seo.title,
    description: home.seo.description,
    keywords: home.seo.keywords,
    openGraph: {
      title: home.seo.title,
      description: home.seo.description,
      images: home.seo.image ? [home.seo.image] : undefined
    }
  };
}

export default async function HomePage() {
  const experience = await getPublishedExperience();

  return <SiteExperience experience={experience} />;
}
