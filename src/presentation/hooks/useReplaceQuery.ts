"use client";

import { useEffect, useRef } from "react";

/**
 * Mirrors UI state into the URL query with history.replaceState (no navigation,
 * no server round-trip), so filters are shareable and survive a reload.
 */
export function useReplaceQuery(path: string, params: Record<string, string | null | undefined>) {
  const first = useRef(true);
  const key = JSON.stringify(params);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(JSON.parse(key) as Record<string, string | null>)) if (v) q.set(k, v);
    const s = q.toString();
    const next = s ? `${path}?${s}` : path;
    if (next !== window.location.pathname + window.location.search) window.history.replaceState(window.history.state, "", next);
  }, [path, key]);
}
