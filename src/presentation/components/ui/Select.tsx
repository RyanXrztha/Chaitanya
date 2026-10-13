"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/presentation/lib/cn";
import { CheckIcon } from "./Icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value" | "children"> {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  /** Accessible name; also the bottom-sheet heading on phones. */
  label: string;
  /** Element the menu aligns to and matches in width (defaults to the select). */
  anchorRef?: RefObject<HTMLElement | null>;
}

const SHEET_QUERY = "(max-width: 640px)";

/**
 * Native <select> (value, forms, a11y) with the premium popup from motion.js:
 * 12px menu with hover tint and a check on the active item; a bottom sheet ≤640px.
 */
export function Select({ value, onValueChange, options, label, anchorRef, className, ...rest }: SelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback((focus: boolean) => {
    setOpen(false);
    if (focus) selectRef.current?.focus({ preventScroll: true });
  }, []);

  const onMouseDown = (e: ReactMouseEvent<HTMLSelectElement>) => {
    if (rest.disabled) return;
    e.preventDefault();
    selectRef.current?.focus({ preventScroll: true });
    setOpen((o) => !o);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLSelectElement>) => {
    if (open) return;
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      <select
        ref={selectRef}
        value={value}
        aria-label={label}
        aria-expanded={open}
        data-open={open || undefined}
        onChange={(e) => onValueChange(e.target.value)}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        className={cn(
          "cursor-pointer appearance-none transition-[border-color,box-shadow,background-color] duration-250 hover:border-[#9ccfc4] data-open:border-brand data-open:shadow-focus",
          className,
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {open && (
        <SelectMenu
          label={label}
          options={options}
          value={value}
          anchorRef={anchorRef ?? selectRef}
          matchWidth={!!anchorRef}
          onChoose={(v) => {
            close(true);
            if (v !== value) onValueChange(v);
          }}
          onClose={close}
        />
      )}
    </>
  );
}

interface MenuProps {
  label: string;
  options: SelectOption[];
  value: string;
  anchorRef: RefObject<HTMLElement | null>;
  matchWidth: boolean;
  onChoose: (value: string) => void;
  onClose: (focus: boolean) => void;
}

function SelectMenu({ label, options, value, anchorRef, matchWidth, onChoose, onClose }: MenuProps) {
  const id = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const [sheet] = useState(() => window.matchMedia(SHEET_QUERY).matches);
  const [up, setUp] = useState(false);

  const place = useCallback(() => {
    const el = menuRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor || sheet) return;
    const r = anchor.getBoundingClientRect();
    el.style.minWidth = `${matchWidth ? r.width : Math.max(180, r.width)}px`;
    el.style.width = matchWidth ? `${r.width}px` : "";
    const h = Math.min(el.scrollHeight, 320);
    const below = window.innerHeight - r.bottom - 12;
    const flip = below < Math.min(h, 200) && r.top > below;
    el.style.maxHeight = `${Math.max(160, Math.min(320, (flip ? r.top : below) - 8))}px`;
    el.style.left = `${Math.max(12, Math.min(r.left, window.innerWidth - el.offsetWidth - 12))}px`;
    el.style.top = `${flip ? r.top - 8 - el.offsetHeight : r.bottom + 8}px`;
    setUp(flip);
  }, [anchorRef, matchWidth, sheet]);

  useLayoutEffect(place, [place]);

  const move = useCallback(
    (from: number, dir: 1 | -1) => {
      let i = from;
      for (let n = 0; n < options.length; n++) {
        i = Math.max(0, Math.min(options.length - 1, i + (n === 0 ? 0 : dir)));
        if (!options[i]?.disabled) break;
      }
      setActive(i);
    },
    [options],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      // The open menu owns the keyboard: stop the event reaching the <select>,
      // whose own handler would otherwise re-open the menu on the same key press.
      e.stopPropagation();
      if (k === "Escape" || k === "Tab") {
        e.preventDefault();
        onClose(true);
      } else if (k === "ArrowDown") {
        e.preventDefault();
        move(active + 1, 1);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        move(active - 1, -1);
      } else if (k === "Home") {
        e.preventDefault();
        move(0, 1);
      } else if (k === "End") {
        e.preventDefault();
        move(options.length - 1, -1);
      } else if (k === "Enter" || k === " ") {
        e.preventDefault();
        if (!options[active]?.disabled) onChoose(options[active].value);
      } else if (k.length === 1) {
        const t = k.toLowerCase();
        for (let j = 1; j <= options.length; j++) {
          const q = (active + j) % options.length;
          if (options[q].label.trim().toLowerCase().startsWith(t)) {
            setActive(q);
            break;
          }
        }
      }
    };
    const onOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && e.target !== anchorRef.current) onClose(false);
    };
    const onScroll = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) place();
    };
    document.addEventListener("keydown", onKey, true);
    const t = setTimeout(() => document.addEventListener("mousedown", onOutside, true), 0);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onOutside, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [active, anchorRef, move, onChoose, onClose, options, place]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    const el = menuRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return createPortal(
    <>
      {sheet && (
        <div className="fixed inset-0 z-[499] bg-[rgba(7,46,52,0.4)] animate-[chy-fade-in_.2s_ease_both]" onClick={() => onClose(true)} />
      )}
      <div
        ref={menuRef}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`${id}-${active}`}
        className={cn(
          "fixed z-[500] box-border overflow-y-auto overscroll-contain bg-white font-body",
          sheet
            ? "inset-x-0 bottom-0 max-h-[70vh] px-md shadow-[0_24px_56px_-16px_rgba(7,46,52,0.32),0_0_0_1px_rgba(7,46,52,0.08)] pt-sm pb-[calc(16px+env(safe-area-inset-bottom))] animate-[chy-sheet-in_.32s_var(--ease-chy)_both]"
            : cn(
                "max-w-[min(420px,calc(100vw-24px))] rounded-menu p-sm shadow-[0_24px_56px_-16px_rgba(7,46,52,0.32),0_0_0_1px_rgba(7,46,52,0.08)] animate-[chy-dd-in_.22s_var(--ease-chy)_both]",
                up ? "origin-bottom" : "origin-top",
              ),
        )}
      >
        {sheet && (
          <div className="relative flex items-center justify-between px-sm pt-md pb-sm font-heading text-[18px] font-bold text-ink before:absolute before:top-sm before:left-1/2 before:-ml-5 before:h-1 before:w-10 before:bg-[#e1dfd6]">
            {label}
          </div>
        )}
        {options.map((o, i) => {
          const selected = o.value === value;
          return (
            <div
              key={o.value}
              id={`${id}-${i}`}
              data-index={i}
              role="option"
              aria-selected={selected}
              aria-disabled={o.disabled || undefined}
              onMouseEnter={() => setActive(i)}
              onClick={() => !o.disabled && onChoose(o.value)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-md rounded-chip px-md select-none transition-[background-color,color] duration-200",
                sheet ? "min-h-[52px] text-[16px]" : "min-h-11 text-[15px]",
                selected ? "bg-brand-100 font-bold text-brand" : cn("font-medium text-ink", i === active && "bg-[#f2f7f5]"),
                o.disabled && "cursor-not-allowed opacity-45",
              )}
            >
              <span>{o.label}</span>
              <CheckIcon
                className={cn(
                  "shrink-0 transition-[opacity,scale] duration-250 ease-chy",
                  selected ? "opacity-100" : "scale-60 opacity-0",
                )}
              />
            </div>
          );
        })}
      </div>
    </>,
    document.body,
  );
}
