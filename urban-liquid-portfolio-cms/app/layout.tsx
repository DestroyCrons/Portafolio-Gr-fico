import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}

