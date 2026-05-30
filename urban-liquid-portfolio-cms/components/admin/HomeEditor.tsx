"use client";

import { useCallback, useState, useTransition } from "react";
import { Eye, RotateCcw, RotateCw, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { publishHomeAction, saveHomeDraftAction } from "@/app/(admin)/admin/homepage/actions";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input, Label, Textarea } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { LayoutBuilder } from "@/components/admin/LayoutBuilder";
import { useAutosave } from "@/hooks/useAutosave";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { HomeContent, Project } from "@/lib/cms/types";
import { useAdminStore } from "@/store/admin-store";

export function HomeEditor({
  initialHome,
  projects
}: {
  initialHome: HomeContent;
  projects: Project[];
}) {
  const [home, setHome] = useState(initialHome);
  const [isPending, startTransition] = useTransition();
  const { pushHistory, undo, redo, previewMode, setPreviewMode } = useAdminStore();

  const save = useCallback(async (value: HomeContent) => {
    await saveHomeDraftAction(value);
  }, []);

  useAutosave(home, save, { delay: 1500 });

  function updateHome(updater: (current: HomeContent) => HomeContent) {
    setHome((current) => {
      pushHistory({ home: current });
      return updater(current);
    });
  }

  function manualSave() {
    startTransition(async () => {
      await saveHomeDraftAction(home);
      toast.success("Homepage draft saved.");
    });
  }

  function publish() {
    startTransition(async () => {
      await publishHomeAction(home);
      toast.success("Homepage published.");
    });
  }

  function applyUndo() {
    const snapshot = undo();
    if (snapshot?.home) setHome(snapshot.home);
  }

  function applyRedo() {
    const snapshot = redo();
    if (snapshot?.home) setHome(snapshot.home);
  }

  useKeyboardShortcuts({
    onSave: manualSave,
    onUndo: applyUndo,
    onRedo: applyRedo,
    onPreview: () => setPreviewMode(!previewMode)
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <div className="space-y-5">
        <GlassPanel className="p-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-sm uppercase text-cyan">Homepage</p>
              <h2 className="font-display text-4xl uppercase text-white">Visual Story</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} onClick={applyUndo}>
                Undo
              </Button>
              <Button variant="ghost" icon={<RotateCw className="h-4 w-4" />} onClick={applyRedo}>
                Redo
              </Button>
              <Button variant="ghost" icon={<Save className="h-4 w-4" />} onClick={manualSave} disabled={isPending}>
                Save
              </Button>
              <Button icon={<Send className="h-4 w-4" />} onClick={publish} disabled={isPending}>
                Publish
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="hero-eyebrow">Hero eyebrow</Label>
                <Input
                  id="hero-eyebrow"
                  value={home.hero.eyebrow}
                  onChange={(event) =>
                    updateHome((current) => ({
                      ...current,
                      hero: { ...current.hero, eyebrow: event.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="hero-cta">Hero CTA</Label>
                <Input
                  id="hero-cta"
                  value={home.hero.ctaLabel}
                  onChange={(event) =>
                    updateHome((current) => ({
                      ...current,
                      hero: { ...current.hero, ctaLabel: event.target.value }
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hero-headline">Hero headline</Label>
              <Textarea
                id="hero-headline"
                value={home.hero.headline}
                onChange={(event) =>
                  updateHome((current) => ({
                    ...current,
                    hero: { ...current.hero, headline: event.target.value }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="hero-subheadline">Hero supporting text</Label>
              <Textarea
                id="hero-subheadline"
                value={home.hero.subheadline}
                onChange={(event) =>
                  updateHome((current) => ({
                    ...current,
                    hero: { ...current.hero, subheadline: event.target.value }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="marquee">Marquee phrases</Label>
              <Input
                id="marquee"
                value={home.hero.marquee.join(", ")}
                onChange={(event) =>
                  updateHome((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      marquee: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    }
                  }))
                }
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-display text-3xl uppercase text-white">About + Contact</p>
          <div className="mt-5 grid gap-5">
            <div>
              <Label htmlFor="about-title">About title</Label>
              <Input
                id="about-title"
                value={home.about.title}
                onChange={(event) =>
                  updateHome((current) => ({
                    ...current,
                    about: { ...current.about, title: event.target.value }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="about-body">About body</Label>
              <Textarea
                id="about-body"
                value={home.about.body}
                onChange={(event) =>
                  updateHome((current) => ({
                    ...current,
                    about: { ...current.about, body: event.target.value }
                  }))
                }
              />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={home.contact.email}
                  onChange={(event) =>
                    updateHome((current) => ({
                      ...current,
                      contact: { ...current.contact, email: event.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={home.contact.city}
                  onChange={(event) =>
                    updateHome((current) => ({
                      ...current,
                      contact: { ...current.contact, city: event.target.value }
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-display text-3xl uppercase text-white">Section Order</p>
          <div className="mt-5">
            <LayoutBuilder
              sections={home.sections}
              onChange={(sections) =>
                updateHome((current) => ({
                  ...current,
                  sections
                }))
              }
            />
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-display text-3xl uppercase text-white">Featured Work</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {projects.map((project) => {
              const checked = home.featuredProjectIds.includes(project.id);
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-white/6 p-3"
                >
                  <span className="truncate text-sm text-white/72">{project.title}</span>
                  <Switch
                    checked={checked}
                    onCheckedChange={(nextChecked) =>
                      updateHome((current) => ({
                        ...current,
                        featuredProjectIds: nextChecked
                          ? [...current.featuredProjectIds, project.id]
                          : current.featuredProjectIds.filter((id) => id !== project.id)
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </div>

      <aside className="xl:sticky xl:top-8 xl:self-start">
        <GlassPanel className="overflow-hidden p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-display text-2xl uppercase text-white">Live Preview</p>
            <Button
              variant="ghost"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Hide" : "View"}
            </Button>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-black p-4">
            <p className="font-display text-xs uppercase text-cyan">{home.hero.eyebrow}</p>
            <h3 className="mt-3 font-display text-5xl uppercase leading-[0.86] text-chrome">
              {home.hero.headline}
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/62">{home.hero.subheadline}</p>
            <div className="mt-5 grid gap-2">
              {home.sections
                .filter((section) => section.enabled)
                .sort((a, b) => a.position - b.position)
                .map((section) => (
                  <div
                    key={section.id}
                    className="rounded-[8px] border border-white/10 bg-white/8 px-3 py-2 text-xs uppercase text-white/54"
                  >
                    {section.label}
                  </div>
                ))}
            </div>
          </div>
        </GlassPanel>
      </aside>
    </div>
  );
}

