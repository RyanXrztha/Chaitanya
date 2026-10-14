import type { ReactNode } from "react";
import { SearchIcon } from "../../ui/Icon";

/** Dashed "no results" panel with recovery actions. */
export function EmptyResults({ title, text, actions, icon = true }: { title: string; text: string; actions: ReactNode; icon?: boolean }) {
  return (
    <div className="flex animate-[chy-fade-in_.4s_ease_both] flex-col items-start gap-md rounded-card border border-dashed border-line-3 bg-[#fafaf8] px-xl py-2xl">
      {icon && (
        <span className="flex size-12 items-center justify-center rounded-chip bg-brand-100">
          <SearchIcon size={22} className="text-brand" />
        </span>
      )}
      <h3 className="m-0 font-heading text-[22px] font-bold text-ink max-md:text-[18px]">{title}</h3>
      <p className="m-0 max-w-[52ch] font-body text-[15px] leading-[1.6] text-muted">{text}</p>
      <div className="flex flex-wrap gap-sm">{actions}</div>
    </div>
  );
}
