"use client";

import { useEffect } from "react";

type ShortcutHandlers = {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
};

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const command = event.metaKey || event.ctrlKey;
      if (!command) return;

      const key = event.key.toLowerCase();
      if (key === "s" && handlers.onSave) {
        event.preventDefault();
        handlers.onSave();
      }
      if (key === "z" && !event.shiftKey && handlers.onUndo) {
        event.preventDefault();
        handlers.onUndo();
      }
      if ((key === "z" && event.shiftKey) || key === "y") {
        if (handlers.onRedo) {
          event.preventDefault();
          handlers.onRedo();
        }
      }
      if (key === "p" && handlers.onPreview) {
        event.preventDefault();
        handlers.onPreview();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}

