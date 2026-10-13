import type { SVGProps } from "react";

// Iconsax/Chakra-style line icons used across the prototypes, drawn on a 24px grid.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, strokeWidth = 2, ...rest }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base({ size: 20, strokeWidth: 2.2, ...p })}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.2, ...p })}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base({ size: 12, strokeWidth: 2.6, ...p })}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronUpIcon = (p: IconProps) => (
  <svg {...base({ size: 20, strokeWidth: 2.2, ...p })}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <svg {...base({ size: 16, strokeWidth: 2.2, ...p })}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base({ size: 14, strokeWidth: 2.4, ...p })}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowUpIcon = (p: IconProps) => (
  <svg {...base({ size: 16, strokeWidth: 2.2, ...p })}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);

/** Filled arrow used on the pre-footer CTA square button. */
export const ArrowSolidIcon = ({ size = 20, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M13.376 18.014a.933.933 0 01-.593-.227.933.933 0 01-.031-1.31l3.906-4.167H4.933C4.426 12.31 4 11.884 4 11.376c0-.507.426-.933.933-.933h11.725l-3.906-4.167a.933.933 0 01.031-1.31c.383-.343.98-.323 1.323.031l4.902 5.24a1.005 1.005 0 010 1.377l-4.902 5.24a.933.933 0 01-.73.32z" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ size: 16, strokeWidth: 2.6, ...p })}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base({ size: 16, ...p })}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base({ size: 16, strokeWidth: 1.8, ...p })}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const FacebookIcon = ({ size = 17, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.2c0-.87.24-1.46 1.5-1.46H16.5V4.14C16.2 4.1 15.19 4 14 4c-2.4 0-4 1.46-4 4.15V10.5H7.5v3H10V21z" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base({ size: 17, strokeWidth: 1.9, ...p })}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export const LinkedInIcon = ({ size = 17, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z" />
  </svg>
);

const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z";

/** Solid five-point star; colour via `fill` (defaults to currentColor). */
export const StarIcon = ({ size = 16, fill = "currentColor", ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden focusable={false} {...p}>
    <path d={STAR} />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base({ size: 22, strokeWidth: 1.8, ...p })}>
    <path d="M22 6l-10 7L2 6" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base({ size: 22, ...p })}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const MapIcon = (p: IconProps) => (
  <svg {...base({ size: 16, strokeWidth: 1.8, ...p })}>
    <path d="M9 3 3 5.5v15.5l6-2.5 6 2.5 6-2.5V3l-6 2.5z" />
    <path d="M9 3v15.5" />
    <path d="M15 5.5V21" />
  </svg>
);

export const StreetViewIcon = (p: IconProps) => (
  <svg {...base({ size: 16, strokeWidth: 1.8, ...p })}>
    <circle cx="12" cy="5" r="2.5" />
    <path d="M9.5 21v-6l-1.5-1v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4l-1.5 1v6" />
  </svg>
);

export const QuoteIcon = ({ size = 26, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M9.5 6C6.5 6 4 8.5 4 11.6V18h6.4v-6.4H7.2c0-1.8 1.2-3.2 2.3-3.2V6zm10 0c-3 0-5.5 2.5-5.5 5.6V18h6.4v-6.4h-3.2c0-1.8 1.2-3.2 2.3-3.2V6z" />
  </svg>
);

export const CircleCheckIcon = (p: IconProps) => (
  <svg {...base({ size: 18, ...p })} strokeLinecap="butt" strokeLinejoin="miter">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.3 2.3 4.7-5.3" />
  </svg>
);
