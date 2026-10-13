import { cn } from "@/presentation/lib/cn";

/** "Call Us" / "Email Us" link laid over a photo (home enquiry block, Reviews page). */
export function ContactChip({ label, value, href, icon }: { label: string; value: string; href: string; icon: "phone" | "mail" }) {
  const shadow = "[text-shadow:0_1px_4px_rgba(0,0,0,0.5)]";
  return (
    <a href={href} className="flex min-w-[180px] flex-1 items-center gap-md px-[18px] py-[14px] text-white no-underline hover:text-white">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="flex-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
        {icon === "phone" ? (
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        ) : (
          <>
            <path d="M22 6l-10 7L2 6" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </>
        )}
      </svg>
      <div>
        <span className={cn("block font-body text-[12px] text-white/85", shadow)}>{label}</span>
        <span className={cn("block font-heading text-[15px] font-bold text-white", shadow)}>{value}</span>
      </div>
    </a>
  );
}
