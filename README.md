# Chaitanya Health & Wellness — Website

Next.js (App Router) + TypeScript + Tailwind CSS v4 implementation of the design handoff in
`design_handoff_chaitanya_website/` (the `*.dc.html` prototypes are the visual ground truth).

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint    # also enforces the architecture dependency rule
npm test        # use-case tests + parity tests against the handoff prototypes
```

### Data & mocks

There is no backend yet. Catalogue data lives in `src/infrastructure/data/` (services
generated from `services-data.js`; products, therapists, reviews, membership tiers and pages
ported from the prototype pages). Bookings, orders, enquiries, contact messages, review
submissions and accounts are stored in memory (lost on restart), and therapist availability
is simulated with the same deterministic rules as `Booking.dc.html`. To go live, implement
the interfaces in `src/domain/repositories` against a real API and swap them in
`src/infrastructure/container.ts`.

Demo account (seeded): `demo@chaitanyawellness.com.np` / `chaitanya123`. The signed-in guest
is kept in `sessionStorage` (profile only, no credentials) — replace with a real session
before launch.

### Pages

| Route | Screen | Notes |
|---|---|---|
| `/` | HomeScreen | |
| `/services`, `/services/[slug]` | ServicesScreen, service detail | |
| `/products`, `/products/[slug]` | ProductsScreen, product detail | |
| `/booking?service=&flow=&duration=` | BookingScreen | not indexed |
| `/about` | AboutScreen | |
| `/membership` | MembershipScreen | "Choose Plan" → `/contact?subject=Membership&plan=<tier>` (pre-filled) |
| `/reviews` | ReviewsScreen | review dates shown relative to today; revalidated hourly |
| `/contact` | ContactScreen | |
| `/info/{faqs,careers,terms,privacy}` | InfoScreen | `/info` redirects to FAQs |
| `/sign-in?mode=signup` | SignInScreen | not indexed |

All contact details come from `src/presentation/lib/clinic.ts` (`CLINIC`).

`tests/parity.test.ts` runs the original prototype scripts and checks that service labels,
search ranking and therapist availability match exactly.

## Architecture

Clean Architecture — dependencies point inwards only, enforced by `no-restricted-imports` in
`eslint.config.mjs`.

```
src/
  domain/            Entities, value objects and repository interfaces. No framework imports.
  application/       Use cases. Depend on domain interfaces, receive repositories via constructor.
  infrastructure/    Data sources (ported from services-data.js / search-index.js / page data),
                     repository implementations, and the composition root (container).
  presentation/
    components/ui        Primitives: Button, Input, Select, Eyebrow, …
    components/layout    SiteHeader, SiteFooter, PreFooterCta, SearchOverlay
    components/features  Domain blocks: ServiceCard, BookingStepper, …
    hooks/               UI state + use-case orchestration
    screens/             One component per page; composed from the above
    fonts/               next/font setup (El Messiri via Google, Lato self-hosted)
  app/               Thin routing layer — each page.tsx renders a screen.
```

## Design tokens

All tokens live in the `@theme` block of `src/app/globals.css` (Tailwind v4 — there is no
`tailwind.config`).

| Group | Utilities |
|---|---|
| Brand | `brand`, `brand-100` … `brand-900` (`#007D67` primary) |
| Ink / neutrals | `ink`, `ink-dark`, `ink-2`, `ink-3`, `muted`, `subtle`, `line`, `line-2/3/4`, `surface`, `surface-2/3`, `cream`, `danger` |
| Type | `font-heading` (El Messiri), `font-body` (Lato), `text-display`, `text-h2` (clamp 24–32px), `text-eyebrow`, `text-body`, `text-body-lg`, `eyebrow` |
| Spacing | `xs` 4 · `sm` 8 · `md` 16 · `lg` 24 · `xl` 32 · `2xl` 48 · `3xl` 64 · `4xl` 96 · `5xl` 128, plus `gutter`, `gutter-wide`, `section`, `section-lg`, `header` |
| Containers | `max-w-content` 1200 · `max-w-site` 1312 · `max-w-wide` 1600 |
| Radius | `rounded-chip` 6 · `rounded-control` 8 · `rounded-card` / `rounded-menu` 12 · `rounded-panel` 16 · `rounded-tile` 20 — as rendered by the prototypes (square by default; full-bleed stays square) |
| Shadow | `shadow-popover`, `shadow-drawer`, `shadow-nav`, `shadow-focus` |
| Motion | `ease-chy`, `ease-zoom`; utilities `btn-sweep`, `zoom-frame`, `link-grow`, `skeleton` |

### Breakpoints

| Screen | Min width | `max-*` variant means |
|---|---|---|
| `xs` | 481 | ≤480 |
| `sm` | 561 | ≤560 |
| `md` | 641 | ≤640 (dropdowns → bottom sheet) |
| **`tablet`** | **761** | **≤760 = mobile** |
| `lg` | 961 | ≤960 (header 68px) |
| `xl` | 1025 | ≤1024 (detail pages stack) |
| **`desktop`** | **1101** | **≤1100 = tablet & below (hamburger)** |

### Prototype rules mirrored globally

`motion.js` restyles the prototypes at runtime; the effective rules are reproduced here:

- Base type is 15px / 1.55 (headings 1.12); paragraphs have a 12px bottom margin.
- Every non-hero `h2` (and an `h3` straight after an eyebrow) is `clamp(24px, 6.4vw, 32px)` → `text-h2`.
- At ≤640px explicit font sizes step down: 16→15, 17–20 ×0.9, 21–28 ×0.82, >28 ×0.72 (min 24);
  applied per element with `max-md:` classes.
- Grids with exactly four auto-fit children become 2 columns at 561–1100px (`sm:max-desktop:grid-cols-2`).
- Sections with a fixed min-height ≥480px shrink to `clamp(260px,62vw,440px)` at ≤960px.
- `figcaption` has a 4px top margin (base theme).
- Everything inside a `<button>` renders Lato 500 (motion.js forces font-family/weight on `button *`) — no heading font or bold inside buttons.
- Headings use -0.015em tracking except on the home page (+0.008em, set by HomeScreen).
- Buttons render Lato 500; nav links use a text-roll hover (`.nav-roll`), not an underline.
- `html, body { overflow-x: clip }` — nothing (e.g. a reveal still offset sideways) may widen the page.
- Forms submit through `useFormAction` (server action from `onSubmit`) so a server-side validation
  error never clears what the guest typed.

### Fonts

Lato is self-hosted at 400 / 500 / 700. Google Fonts only serves Lato 400/700, while the
prototypes load Lato Medium separately for buttons and nav. Weight 600 resolves to Bold, as
in the prototypes.
