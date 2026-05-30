"use client";

import { useEffect, useRef } from "react";

export function useAutosave<T>(
  value: T,
  save: (value: T) => Promise<void>,
  options: { enabled?: boolean; delay?: number } = {}
) {
  const hasMounted = useRef(false);
  const delay = options.delay ?? 1200;
  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      void save(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay, enabled, save, value]);
}

