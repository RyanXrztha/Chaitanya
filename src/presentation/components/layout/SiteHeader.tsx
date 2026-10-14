"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEscapeKey } from "@/presentation/hooks/useEscapeKey";
import { useScrolledPast } from "@/presentation/hooks/useScrollPosition";
import { cn } from "@/presentation/lib/cn";
import { NAV_ITEMS, PAGE_PATHS, navKeyForPath } from "@/presentation/lib/routes";
import type { MegaMenuCategory } from "@/presentation/lib/site-data";
import { ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "../ui/Icon";
import { AccountLabel } from "./AccountProvider";
import { MegaMenu } from "./MegaMenu";
import { MobileNavPanel } from "./MobileNavPanel";
import { useSearch } from "./SearchProvider";

const MEGA_CLOSE_DELAY = 160;

interface SiteHeaderProps {
  megaMenu: MegaMenuCategory[];
}

/**
 * Global header. On the home page it floats transparently over the hero video and
 * docks as a white bar once the hero is 60% scrolled; elsewhere it is a sticky white bar.
 */
export function SiteHeader({ megaMenu }: SiteHeaderProps) {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const current = navKeyForPath(pathname);
  const search = useSearch();

  const navRef = useRef<HTMLElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mega, setMega] = useState<{ open: boolean; top: number; category: string }>({
    open: false,
    top: 76,
    category: megaMenu[0]?.key ?? "featured",
  });
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scrolled = useScrolledPast(8);
  const docked = useScrolledPast(() => window.innerHeight * 0.6) && overlay;

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setPanelOpen(false);
    setMega((m) => ({ ...m, open: false }));
  }

  const openMega = useCallback(() => {
    clearTimeout(closeTimer.current);
    if (window.matchMedia("(max-width: 1100px)").matches) return;
    const bottom = Math.max(0, Math.round(navRef.current?.getBoundingClientRect().bottom ?? 76));
    setMega((m) => (m.open && m.top === bottom ? m : { ...m, open: true, top: bottom }));
  }, []);
  const holdMega = useCallback(() => clearTimeout(closeTimer.current), []);
  const leaveMega = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega((m) => ({ ...m, open: false })), MEGA_CLOSE_DELAY);
  }, []);

  useEffect(() => {
    if (!mega.open) return;
    const onScroll = () => setMega((m) => ({ ...m, open: false }));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mega.open]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEscapeKey(mega.open || panelOpen, () => {
    setMega((m) => ({ ...m, open: false }));
    setPanelOpen(false);
  });

  // Panel only exists at ≤1100px; drop it if the viewport grows.
  useEffect(() => {
    if (!panelOpen) return;
    const mql = window.matchMedia("(max-width: 1100px)");
    const onChange = () => !mql.matches && setPanelOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [panelOpen]);

  /** Transparent over the hero: white text and logo. */
  const light = overlay && !docked && !mega.open;

  const openSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setPanelOpen(false);
    search.open();
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main"
        onMouseLeave={leaveMega}
        className={cn(
          "z-40 flex flex-nowrap items-center gap-[clamp(8px,1.6vw,32px)] px-[clamp(24px,4vw,128px)] font-body transition-[background-color,box-shadow,color] duration-300",
          overlay
            ? docked
              ? "fixed inset-x-0 top-0 z-50 bg-white py-[14px] text-ink shadow-nav animate-[chy-nav-in_.45s_var(--ease-chy)_both]"
              : cn(
                  "absolute inset-x-0 top-0 mt-[clamp(0px,0.8vw,8px)] py-sm",
                  light ? "bg-transparent text-white" : "bg-white text-ink shadow-[0_1px_0_#eceee9]",
                )
            : cn(
                "sticky top-0 bg-white py-[10px] text-ink",
                scrolled ? "shadow-nav" : "shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
              ),
        )}
      >
        <Link href={PAGE_PATHS.home} aria-label="Chaitanya home" className="flex shrink-0 items-center hover:opacity-90">
          {light ? (
            <Image
              src="/images/logos/chaitanya-logo-white.svg"
              alt="Chaitanya Health & Wellness"
              width={326}
              height={203}
              loading="eager"
              className="block h-[clamp(42px,5vw,54px)] w-auto"
            />
          ) : (
            <Image
              src="/images/logos/chaitanya-logo-color.png"
              alt="Chaitanya Health & Wellness"
              width={335}
              height={208}
              loading="eager"
              className={cn("block w-auto", overlay ? "h-[clamp(42px,5vw,54px)]" : "h-[clamp(44px,5vw,56px)]")}
            />
          )}
        </Link>

        {/* Desktop links */}
        <div className="flex min-w-0 flex-auto flex-nowrap items-center justify-center gap-[clamp(0px,0.4vw,8px)] overflow-x-auto scrollbar-none max-desktop:hidden">
          {NAV_ITEMS.map((item) => {
            const isCurrent = item.key === current;
            const isServices = item.key === "services";
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                aria-haspopup={isServices ? "true" : undefined}
                aria-expanded={isServices ? mega.open : undefined}
                onMouseEnter={isServices ? openMega : leaveMega}
                onFocus={isServices ? openMega : leaveMega}
                className={cn(
                  "inline-flex h-[38px] shrink-0 items-center px-[clamp(8px,0.9vw,14px)] text-[clamp(13px,1.05vw,14.5px)] font-medium whitespace-nowrap no-underline transition-[color,opacity] duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:opacity-70",
                  light
                    ? cn("text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]", isCurrent ? "opacity-100" : "opacity-80 hover:opacity-100")
                    : cn(isCurrent ? "text-brand" : "text-ink hover:text-brand"),
                )}
              >
                <span className="nav-roll">
                  <span data-l={item.label}>{item.label}</span>
                </span>
                {isServices && (
                  <ChevronDownIcon
                    className={cn("ml-1 transition-transform duration-300", mega.open && "rotate-180")}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-sm">
          <a
            href="#search"
            onClick={openSearch}
            aria-label="Search services"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-control no-underline transition-colors duration-250",
              light
                ? "bg-white/16 text-white backdrop-blur-[8px] hover:bg-white/28"
                : "bg-surface-3 text-ink hover:bg-brand-100 hover:text-brand",
            )}
          >
            <SearchIcon />
          </a>
          <Link
            href={PAGE_PATHS["sign-in"]}
            className={cn(
              "btn-sweep flex h-11 shrink-0 items-center gap-sm rounded-control px-[22px] text-[14px] leading-none font-medium no-underline transition-colors duration-250 max-desktop:hidden",
              light ? "bg-white text-brand hover:bg-brand-100" : "bg-brand text-white hover:bg-brand-600",
            )}
          >
            <UserIcon />
            <AccountLabel />
          </Link>
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            aria-label={panelOpen ? "Close menu" : "Open menu"}
            aria-expanded={panelOpen}
            aria-controls="mobile-nav"
            className={cn(
              "flex size-11 items-center justify-center rounded-control border-0 p-0 active:scale-95 desktop:hidden",
              overlay ? "bg-white text-brand" : "bg-brand text-white",
            )}
          >
            {panelOpen ? <CloseIcon size={20} /> : <MenuIcon />}
          </button>
        </div>

        {panelOpen && (
          <MobileNavPanel
            id="mobile-nav"
            floating={overlay && !docked}
            current={current}
            categories={megaMenu}
            onNavigate={() => setPanelOpen(false)}
          />
        )}
      </nav>

      {mega.open && (
        <MegaMenu
          top={mega.top}
          categories={megaMenu}
          activeKey={mega.category}
          onActivate={(key) => setMega((m) => ({ ...m, category: key }))}
          onMouseEnter={holdMega}
          onMouseLeave={leaveMega}
        />
      )}
    </>
  );
}
