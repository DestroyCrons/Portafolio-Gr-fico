"use client";

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
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { SectionConfig } from "@/lib/cms/types";

function SortableSection({
  section,
  onToggle
}: {
  section: SectionConfig;
  onToggle: (enabled: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className="rounded-[8px] border border-white/10 bg-white/6 p-3"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Move ${section.label}`}
          className="focus-ring rounded-[8px] border border-white/10 bg-black/24 p-2 text-white/48"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl uppercase text-white">{section.label}</p>
          <p className="text-xs uppercase text-white/38">Position {section.position + 1}</p>
        </div>
        {section.enabled ? <Eye className="h-4 w-4 text-cyan" /> : <EyeOff className="h-4 w-4 text-white/30" />}
        <Switch checked={section.enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}

export function LayoutBuilder({
  sections,
  onChange
}: {
  sections: SectionConfig[];
  onChange: (sections: SectionConfig[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ordered = [...sections].sort((a, b) => a.position - b.position);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((section) => section.id === active.id);
    const newIndex = ordered.findIndex((section) => section.id === over.id);
    const next = arrayMove(ordered, oldIndex, newIndex).map((section, index) => ({
      ...section,
      position: index
    }));
    onChange(next);
  }

  function toggleSection(id: string, enabled: boolean) {
    onChange(
      ordered.map((section) => (section.id === id ? { ...section, enabled } : section))
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ordered.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {ordered.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onToggle={(enabled) => toggleSection(section.id, enabled)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="rounded-[8px] border border-white/10 bg-black/24 p-4">
        <p className="font-display text-2xl uppercase text-white">Live Structure</p>
        <div className="mt-4 grid auto-rows-[58px] grid-cols-4 gap-2">
          {ordered
            .filter((section) => section.enabled)
            .map((section, index) => (
              <div
                key={section.id}
                className="flex items-center justify-center rounded-[8px] border border-cyan/24 bg-cyan/10 px-2 text-center text-[10px] font-semibold uppercase text-cyan"
                style={{
                  gridColumn: index === 0 ? "span 4" : "span 2"
                }}
              >
                {section.label}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

