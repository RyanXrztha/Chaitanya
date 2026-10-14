"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SearchOverlay } from "./SearchOverlay";

interface SearchContextValue {
  isOpen: boolean;
  open: (query?: string) => void;
  close: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** Hosts the global search overlay; opened from the header, page CTAs, ⌘K / Ctrl+K or "/". */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; query: string; session: number }>({
    open: false,
    query: "",
    session: 0,
  });

  const open = useCallback((query = "") => setState((s) => ({ open: true, query, session: s.session + 1 })), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toUpperCase();
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement as HTMLElement | null)?.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(() => ({ isOpen: state.open, open, close }), [state.open, open, close]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      {state.open && <SearchOverlay key={state.session} initialQuery={state.query} onClose={close} />}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchProvider>");
  return ctx;
}
