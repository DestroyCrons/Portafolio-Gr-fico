import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { getPublishedProjects } from "@/lib/cms/queries";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Urban Liquid Portfolio",
    template: "%s | Urban Liquid Portfolio"
  },
  description:
    "Experimental graphic design portfolio with liquid glass, street culture, cinematic motion, and a private CMS.",
  openGraph: {
    title: "Urban Liquid Portfolio",
    description:
      "Experimental graphic design portfolio with liquid glass, street culture, cinematic motion, and a private CMS.",
    type: "website"
  }
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090a0c"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Leer la fuente guardada en el CMS para aplicarla al <html>
  let displayFont: string | undefined;
  try {
    const { getPublishedExperience } = await import("@/lib/cms/queries");
    const experience = await getPublishedExperience();
    displayFont = experience.home.typography?.displayFont;
  } catch {
    // Si falla (ej. sin Supabase), usa el default de globals.css
  }

  const fontStyle = displayFont
    ? `--font-display: ${displayFont};`
    : undefined;

  return (
    <html lang="en" suppressHydrationWarning style={fontStyle ? { ["--font-display" as string]: displayFont } : undefined}>
      <body>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}
