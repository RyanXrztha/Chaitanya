import type { ElementType, ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  /** "light" = teal on white; "dark" = #4FBBA5 on dark sections; "white" = over photos/video. */
  tone?: "light" | "dark" | "white";
  align?: "start" | "center";
  as?: ElementType;
  className?: string;
}

/** Pre-header shown above every section heading, framed by the naturopathy ornaments. */
export function Eyebrow({ children, tone = "light", align = "start", as: Tag = "p", className }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "eyebrow m-0",
        tone === "dark" ? "text-brand-400" : tone === "white" ? "text-white" : "text-brand",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span>{children}</span>
    </Tag>
  );
}
