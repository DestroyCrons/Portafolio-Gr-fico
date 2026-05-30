"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Boxes,
  Eye,
  FileImage,
  Home,
  History,
  LayoutDashboard,
  Palette,
  Settings
} from "lucide-react";
import type { AdminProfile } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { useAdminStore } from "@/store/admin-store";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Boxes },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/media", label: "Media", icon: FileImage },
  { href: "/admin/settings", label: "Motion + SEO", icon: Settings },
  { href: "/admin/history", label: "History", icon: History },
  { href: "/admin/preview", label: "Preview", icon: Eye }
];

export function AdminShell({
  profile,
  children
}: {
  profile: AdminProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const theme = useAdminStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
  }, [theme]);

  return (
    <div className="admin-surface min-h-screen text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-black/36 p-4 backdrop-blur-glass lg:block">
        <Link href="/admin" className="glass-panel flex items-center gap-3 rounded-[8px] p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-acid/40 bg-acid text-black">
            <Palette className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-lg uppercase text-white">Liquid Studio</span>
            <span className="text-xs uppercase text-white/42">Private CMS</span>
          </span>
        </Link>
        <nav className="mt-6 grid gap-2">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-[8px] border px-3 py-3 text-sm font-semibold uppercase transition",
                  active
                    ? "border-cyan/50 bg-cyan/12 text-cyan"
                    : "border-transparent text-white/54 hover:border-white/12 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-[8px] border border-white/10 bg-white/6 p-3">
            <p className="text-xs uppercase text-white/42">Signed in</p>
            <p className="mt-1 truncate text-sm text-white/78">
              {profile.display_name ?? profile.email ?? "Admin"}
            </p>
          </div>
          <div className="mt-3">
            <SignOutButton />
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/42 px-5 py-4 backdrop-blur-glass lg:hidden">
          <Link href="/admin" className="font-display text-xl uppercase text-chrome">
            Liquid Studio
          </Link>
          <SignOutButton />
        </header>
        <nav className="sticky top-[73px] z-20 flex gap-2 overflow-x-auto border-b border-white/10 bg-black/36 px-5 py-3 backdrop-blur-glass lg:hidden">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] border px-3 text-xs font-semibold uppercase transition",
                  active
                    ? "border-cyan/50 bg-cyan/12 text-cyan"
                    : "border-white/10 bg-white/6 text-white/54"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
