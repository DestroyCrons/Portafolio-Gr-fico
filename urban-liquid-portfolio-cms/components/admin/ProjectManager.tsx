"use client";

import { useMemo, useState, useTransition } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Eye, EyeOff, GripVertical, ImagePlus, Pin, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProjectAction,
  reorderProjectsAction,
  saveProjectAction,
  toggleProjectVisibilityAction
} from "@/app/(admin)/admin/projects/actions";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { Project } from "@/lib/cms/types";
import { defaultProjects } from "@/lib/cms/defaults";
import { slugify } from "@/lib/utils";

const blankProject = (): Project => ({
  ...defaultProjects[0],
  id: crypto.randomUUID(),
  slug: "new-project",
  title: "New Project",
  eyebrow: "Identity / Motion",
  summary: "",
  description: "",
  category: "Experimental",
  tags: [],
  coverUrl: "",
  videoUrl: "",
  externalUrl: "",
  featured: false,
  visible: true,
  status: "draft",
  position: 999,
  layout: {
    variant: "bento-wide",
    colSpan: 1,
    rowSpan: 1,
    accent: "cyan"
  },
  media: []
});

function SortableProjectRow({
  project,
  active,
  onSelect
}: {
  project: Project;
  active: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={`rounded-[8px] border p-3 transition ${
        active ? "border-cyan/55 bg-cyan/10" : "border-white/10 bg-white/6 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="focus-ring rounded-[8px] border border-white/10 bg-black/20 p-2 text-white/50"
          aria-label={`Reorder ${project.title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <span className="block truncate font-display text-xl uppercase text-white">{project.title}</span>
          <span className="mt-1 block truncate text-xs uppercase text-white/42">
            {project.category} / {project.status}
          </span>
        </button>
        {project.featured ? <Pin className="h-4 w-4 text-acid" /> : null}
        {project.visible ? <Eye className="h-4 w-4 text-cyan" /> : <EyeOff className="h-4 w-4 text-white/34" />}
      </div>
    </div>
  );
}

export function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [draft, setDraft] = useState<Project>(initialProjects[0] ?? blankProject());
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const tagsValue = useMemo(() => draft.tags.join(", "), [draft.tags]);

  function setField<K extends keyof Project>(key: K, value: Project[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function selectProject(project: Project) {
    setDraft(project);
  }

  function createProject() {
    const next = blankProject();
    setProjects((current) => [...current, next]);
    setDraft(next);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((project) => project.id === active.id);
    const newIndex = projects.findIndex((project) => project.id === over.id);
    const nextProjects = arrayMove(projects, oldIndex, newIndex).map((project, index) => ({
      ...project,
      position: index
    }));

    setProjects(nextProjects);
    startTransition(async () => {
      await reorderProjectsAction(nextProjects.map((project) => ({ id: project.id, position: project.position })));
      toast.success("Project order updated.");
    });
  }

  function saveDraft(status = draft.status) {
    const nextDraft = {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      status
    };

    startTransition(async () => {
      const { id } = await saveProjectAction(nextDraft);
      setProjects((current) => {
        const exists = current.some((project) => project.id === id);
        const updated = { ...nextDraft, id };
        return exists
          ? current.map((project) => (project.id === id ? updated : project))
          : [...current, updated];
      });
      setDraft((current) => ({ ...current, id, status }));
      toast.success(status === "published" ? "Project published." : "Project saved.");
    });
  }

  function deleteDraft() {
    startTransition(async () => {
      await deleteProjectAction(draft.id);
      const nextProjects = projects.filter((project) => project.id !== draft.id);
      setProjects(nextProjects);
      setDraft(nextProjects[0] ?? blankProject());
      toast.success("Project deleted.");
    });
  }

  function toggleVisibility(visible: boolean) {
    setField("visible", visible);
    startTransition(async () => {
      await toggleProjectVisibilityAction(draft.id, visible);
      toast.success(visible ? "Project visible." : "Project hidden.");
    });
  }

  function publish() {
    const nextDraft: Project = {
      ...draft,
      status: "published",
      visible: true
    };

    startTransition(async () => {
      const { id } = await saveProjectAction(nextDraft);
      setDraft((current) => ({ ...current, id, status: "published", visible: true }));
      setProjects((current) =>
        current.map((project) => (project.id === draft.id ? { ...nextDraft, id } : project))
      );
      toast.success("Project published.");
    });
  }

  async function uploadAsset(file: File, target: "coverUrl" | "videoUrl") {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "projects");

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body
    });

    if (!response.ok) {
      toast.error("Upload failed.");
      return;
    }

    const asset = (await response.json()) as { url: string };
    setField(target, asset.url);
    toast.success("Asset uploaded.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <GlassPanel className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-2xl uppercase text-white">Projects</p>
            <p className="text-xs uppercase text-white/42">Drag to reorder</p>
          </div>
          <Button icon={<Plus className="h-4 w-4" />} onClick={createProject}>
            Add
          </Button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {projects.map((project) => (
                <SortableProjectRow
                  key={project.id}
                  project={project}
                  active={project.id === draft.id}
                  onSelect={() => selectProject(project)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </GlassPanel>

      <GlassPanel className="p-5">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase text-white/42">Editing</p>
            <h2 className="font-display text-4xl uppercase text-white">{draft.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" icon={<Save className="h-4 w-4" />} onClick={() => saveDraft()} disabled={isPending}>
              Save
            </Button>
            <Button icon={<Check className="h-4 w-4" />} onClick={publish} disabled={isPending}>
              Publish
            </Button>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={deleteDraft} disabled={isPending}>
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={draft.title} onChange={(event) => setField("title", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={draft.slug} onChange={(event) => setField("slug", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="eyebrow">Eyebrow</Label>
            <Input id="eyebrow" value={draft.eyebrow} onChange={(event) => setField("eyebrow", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={draft.category} onChange={(event) => setField("category", event.target.value)} />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="summary">Short description</Label>
            <Textarea
              id="summary"
              value={draft.summary}
              onChange={(event) => setField("summary", event.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="description">Case study description</Label>
            <Textarea
              id="description"
              value={draft.description}
              onChange={(event) => setField("description", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsValue}
              onChange={(event) =>
                setField(
                  "tags",
                  event.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>
          <div>
            <Label htmlFor="external">External link</Label>
            <Input
              id="external"
              value={draft.externalUrl ?? ""}
              onChange={(event) => setField("externalUrl", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cover">Thumbnail URL</Label>
            <div className="flex gap-2">
              <Input id="cover" value={draft.coverUrl} onChange={(event) => setField("coverUrl", event.target.value)} />
              <label className="focus-ring inline-flex h-11 w-12 items-center justify-center rounded-[8px] border border-white/12 bg-white/8 text-white transition hover:border-cyan hover:text-cyan">
                <ImagePlus className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadAsset(file, "coverUrl");
                  }}
                />
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="video">Video URL</Label>
            <div className="flex gap-2">
              <Input id="video" value={draft.videoUrl ?? ""} onChange={(event) => setField("videoUrl", event.target.value)} />
              <label className="focus-ring inline-flex h-11 w-12 items-center justify-center rounded-[8px] border border-white/12 bg-white/8 text-white transition hover:border-cyan hover:text-cyan">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadAsset(file, "videoUrl");
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[8px] border border-white/10 bg-white/6 p-4">
            <p className="font-display text-2xl uppercase text-white">Visual Formation</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="variant">Layout</Label>
                <Select
                  id="variant"
                  value={draft.layout.variant}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      layout: { ...current.layout, variant: event.target.value as Project["layout"]["variant"] }
                    }))
                  }
                >
                  {["bento-wide", "bento-tall", "poster", "split", "immersive"].map((variant) => (
                    <option key={variant}>{variant}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="accent">Accent</Label>
                <Select
                  id="accent"
                  value={draft.layout.accent}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      layout: { ...current.layout, accent: event.target.value as Project["layout"]["accent"] }
                    }))
                  }
                >
                  {["cyan", "acid", "violet", "signal", "chrome"].map((accent) => (
                    <option key={accent}>{accent}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="cols">Card width</Label>
                <Input
                  id="cols"
                  type="number"
                  min={1}
                  max={3}
                  value={draft.layout.colSpan}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      layout: { ...current.layout, colSpan: Number(event.target.value) }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="rows">Card height</Label>
                <Input
                  id="rows"
                  type="number"
                  min={1}
                  max={3}
                  value={draft.layout.rowSpan}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      layout: { ...current.layout, rowSpan: Number(event.target.value) }
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/6 p-4">
            <p className="font-display text-2xl uppercase text-white">Publishing</p>
            <div className="mt-5 grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm uppercase text-white/58">Featured</span>
                <Switch checked={draft.featured} onCheckedChange={(checked) => setField("featured", checked)} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm uppercase text-white/58">Visible</span>
                <Switch checked={draft.visible} onCheckedChange={toggleVisibility} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={draft.status}
                  onChange={(event) => setField("status", event.target.value as Project["status"])}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
