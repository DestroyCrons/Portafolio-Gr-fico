"use client";

import { useEffect } from "react";

export function AnalyticsBeacon({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const body = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer
    });

    if ("sendBeacon" in navigator) {
      navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    });
  }, [enabled]);

  return null;
}

