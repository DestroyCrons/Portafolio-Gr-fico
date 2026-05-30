"use client";

import { useCallback, useState, useTransition } from "react";
import { Moon, Save, Send, Sun } from "lucide-react";
import { toast } from "sonner";
import { publishSettingsAction, saveSettingsAction } from "@/app/(admin)/admin/settings/actions";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useAutosave } from "@/hooks/useAutosave";
import type { HomeContent } from "@/lib/cms/types";
import { useAdminStore } from "@/store/admin-store";

export function MotionSeoEditor({ initialHome }: { initialHome: HomeContent }) {
  const [home, setHome] = useState(initialHome);
  const [isPending, startTransition] = useTransition();
  const { theme, toggleTheme } = useAdminStore();

  const save = useCallback(async (value: HomeContent) => {
    await saveSettingsAction(value);
  }, []);

  useAutosave(home, save, { delay: 1500 });

  function manualSave() {
    startTransition(async () => {
      await saveSettingsAction(home);
      toast.success("Settings saved.");
    });
  }

  function publish() {
    startTransition(async () => {
      await publishSettingsAction(home);
      toast.success("Settings published.");
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
      <GlassPanel className="p-5">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-sm uppercase text-cyan">Motion</p>
            <h2 className="font-display text-4xl uppercase text-white">Animation Controls</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" icon={<Save className="h-4 w-4" />} onClick={manualSave} disabled={isPending}>
              Save
            </Button>
            <Button icon={<Send className="h-4 w-4" />} onClick={publish} disabled={isPending}>
              Publish
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="flex items-center justify-between gap-4 rounded-[8px] border border-white/10 bg-white/6 p-4">
            <div>
              <p className="font-display text-2xl uppercase text-white">Animations</p>
              <p className="mt-1 text-xs uppercase text-white/42">Global motion switch</p>
            </div>
            <Switch
              checked={home.motion.enabled}
              onCheckedChange={(checked) =>
                setHome((current) => ({
                  ...current,
                  motion: { ...current.motion, enabled: checked }
                }))
              }
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="preset">Motion preset</Label>
              <Select
                id="preset"
                value={home.motion.preset}
                onChange={(event) =>
                  setHome((current) => ({
                    ...current,
                    motion: { ...current.motion, preset: event.target.value as HomeContent["motion"]["preset"] }
                  }))
                }
              >
                <option value="liquid">liquid</option>
                <option value="glitch">glitch</option>
                <option value="cinematic">cinematic</option>
                <option value="minimal">minimal</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="transition">Transition style</Label>
              <Select
                id="transition"
                value={home.motion.transition}
                onChange={(event) =>
                  setHome((current) => ({
                    ...current,
                    motion: {
                      ...current.motion,
                      transition: event.target.value as HomeContent["motion"]["transition"]
                    }
                  }))
                }
              >
                <option value="mask">mask</option>
                <option value="slide">slide</option>
                <option value="fade">fade</option>
                <option value="glitch">glitch</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="intensity">Animation intensity: {home.motion.intensity}</Label>
            <input
              id="intensity"
              type="range"
              min={0}
              max={100}
              value={home.motion.intensity}
              onChange={(event) =>
                setHome((current) => ({
                  ...current,
                  motion: { ...current.motion, intensity: Number(event.target.value) }
                }))
              }
              className="w-full accent-acid"
            />
          </div>
          <div>
            <Label htmlFor="mobile-motion">Mobile motion scale: {home.performance.mobileMotionScale}</Label>
            <input
              id="mobile-motion"
              type="range"
              min={0}
              max={100}
              value={home.performance.mobileMotionScale}
              onChange={(event) =>
                setHome((current) => ({
                  ...current,
                  performance: { ...current.performance, mobileMotionScale: Number(event.target.value) }
                }))
              }
              className="w-full accent-cyan"
            />
          </div>
        </div>
      </GlassPanel>

      <div className="space-y-5">
        <GlassPanel className="p-5">
          <p className="font-display text-3xl uppercase text-white">SEO</p>
          <div className="mt-5 grid gap-5">
            <div>
              <Label htmlFor="seo-title">Metadata title</Label>
              <Input
                id="seo-title"
                value={home.seo.title}
                onChange={(event) =>
                  setHome((current) => ({
                    ...current,
                    seo: { ...current.seo, title: event.target.value }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="seo-description">Metadata description</Label>
              <Textarea
                id="seo-description"
                value={home.seo.description}
                onChange={(event) =>
                  setHome((current) => ({
                    ...current,
                    seo: { ...current.seo, description: event.target.value }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="seo-keywords">Keywords</Label>
              <Input
                id="seo-keywords"
                value={home.seo.keywords.join(", ")}
                onChange={(event) =>
                  setHome((current) => ({
                    ...current,
                    seo: {
                      ...current.seo,
                      keywords: event.target.value
                        .split(",")
                        .map((keyword) => keyword.trim())
                        .filter(Boolean)
                    }
                  }))
                }
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-display text-3xl uppercase text-white">Performance</p>
          <div className="mt-5 grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm uppercase text-white/58">Lazy media</span>
              <Switch
                checked={home.performance.lazyMedia}
                onCheckedChange={(checked) =>
                  setHome((current) => ({
                    ...current,
                    performance: { ...current.performance, lazyMedia: checked }
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm uppercase text-white/58">Analytics</span>
              <Switch
                checked={home.performance.analyticsEnabled}
                onCheckedChange={(checked) =>
                  setHome((current) => ({
                    ...current,
                    performance: { ...current.performance, analyticsEnabled: checked }
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm uppercase text-white/58">Sitemap</span>
              <Switch
                checked={home.performance.sitemapEnabled}
                onCheckedChange={(checked) =>
                  setHome((current) => ({
                    ...current,
                    performance: { ...current.performance, sitemapEnabled: checked }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="quality">Image quality: {home.performance.imageQuality}</Label>
              <input
                id="quality"
                type="range"
                min={40}
                max={100}
                value={home.performance.imageQuality}
                onChange={(event) =>
                  setHome((current) => ({
                    ...current,
                    performance: { ...current.performance, imageQuality: Number(event.target.value) }
                  }))
                }
                className="w-full accent-acid"
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-display text-3xl uppercase text-white">Admin Mode</p>
          <Button
            variant="ghost"
            icon={theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            className="mt-5"
            onClick={toggleTheme}
          >
            {theme}
          </Button>
        </GlassPanel>
      </div>
    </div>
  );
}

