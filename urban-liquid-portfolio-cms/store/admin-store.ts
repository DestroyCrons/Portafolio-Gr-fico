"use client";

import { create } from "zustand";
import type { HomeContent, Project } from "@/lib/cms/types";

type Snapshot = {
  home?: HomeContent;
  projects?: Project[];
};

type AdminState = {
  previewMode: boolean;
  dirty: boolean;
  theme: "dark" | "light";
  history: Snapshot[];
  future: Snapshot[];
  setPreviewMode: (previewMode: boolean) => void;
  setDirty: (dirty: boolean) => void;
  toggleTheme: () => void;
  pushHistory: (snapshot: Snapshot) => void;
  undo: () => Snapshot | undefined;
  redo: () => Snapshot | undefined;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  previewMode: false,
  dirty: false,
  theme: "dark",
  history: [],
  future: [],
  setPreviewMode: (previewMode) => set({ previewMode }),
  setDirty: (dirty) => set({ dirty }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  pushHistory: (snapshot) =>
    set((state) => ({
      history: [...state.history.slice(-24), snapshot],
      future: [],
      dirty: true
    })),
  undo: () => {
    const { history, future } = get();
    const previous = history.at(-1);
    if (!previous) return undefined;

    set({
      history: history.slice(0, -1),
      future: [previous, ...future],
      dirty: true
    });

    return previous;
  },
  redo: () => {
    const { history, future } = get();
    const next = future[0];
    if (!next) return undefined;

    set({
      history: [...history, next],
      future: future.slice(1),
      dirty: true
    });

    return next;
  }
}));

