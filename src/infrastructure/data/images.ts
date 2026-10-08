import type { ImageRef } from "@/domain";

// Port of design_handoff/demo-photos.js: deterministic demo photography per slot,
// so every card/gallery shows the same picture as in the prototypes.

const PHOTO_DIR = "/images/photos/";

// The prototype's sixth stock photo ("spa-team.jpg") is actually a résumé/job
// interview shot, so it is never used; slots that would draw it fall back to
// another spa photo, keeping every other slot identical to the prototype.
const PHOTOS = [
  "spa-woman-flower.jpg",
  "spa-young-woman.jpg",
  "spa-couple-facial.jpg",
  "spa-juice.jpg",
  "spa-tea-robes.jpg",
];
const PROTOTYPE_PHOTO_COUNT = 6;

/** Keyword pools: the first matching pattern decides which photos a service draws from. */
const KEYWORD_POOLS: [RegExp, string[]][] = [
  [
    /brazilian|wax|threading|facial|cleansing|melasma|acne|aging|manicure|pedicure|hair wash|hair treatment|blow dry|beauty care/,
    ["spa-couple-facial.jpg", "spa-young-woman.jpg"],
  ],
  [/sauna|steam|foot bath|scrub|polish|glow/, ["spa-tea-robes.jpg", "spa-woman-flower.jpg"]],
  [/package|party|delight|self care/, ["spa-juice.jpg", "spa-tea-robes.jpg"]],
];
const DEFAULT_POOL = ["spa-woman-flower.jpg", "spa-young-woman.jpg", "spa-couple-facial.jpg"];

/** Hero photo per service category (header mega-menu, category tiles). */
const CATEGORY_PHOTOS: Record<string, string> = {
  featured: "spa-woman-flower.jpg",
  package: "spa-juice.jpg",
  relax: "spa-young-woman.jpg",
  wellness: "spa-woman-flower.jpg",
  beauty: "spa-couple-facial.jpg",
  treatment: "spa-young-woman.jpg",
  hydro: "spa-tea-robes.jpg",
};

export const SERVICE_GALLERY_LABELS = [
  "Treatment room",
  "Therapy in session",
  "Oils & ingredients",
  "Relaxation lounge",
  "Detail shot",
];

export const PRODUCT_GALLERY_LABELS = ["Front of pack", "Product close-up", "In use", "Ingredients"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Any slot without a dedicated image: a stable pick from the photo set. */
export function photoForSlot(slotId: string): string {
  const h = hash(slotId);
  const pick = h % PROTOTYPE_PHOTO_COUNT;
  return PHOTO_DIR + PHOTOS[pick < PHOTOS.length ? pick : h % PHOTOS.length];
}

export function serviceImages(id: number, name: string): ImageRef[] {
  const n = name.toLowerCase();
  const pool = KEYWORD_POOLS.find(([re]) => re.test(n))?.[1] ?? DEFAULT_POOL;
  return SERVICE_GALLERY_LABELS.map((label, i) => ({
    src: PHOTO_DIR + pool[(id + i) % pool.length],
    alt: `${name} — ${label.toLowerCase()}`,
    caption: label,
  }));
}

export function categoryImage(categoryKey: string, label: string): ImageRef {
  return { src: PHOTO_DIR + (CATEGORY_PHOTOS[categoryKey] ?? DEFAULT_POOL[0]), alt: label };
}

export function productImages(id: number, name: string): ImageRef[] {
  return PRODUCT_GALLERY_LABELS.map((label, i) => ({
    src: i === 0 ? `/images/slots/prod-${id}.webp` : photoForSlot(`prod-${id}-${i + 1}`),
    alt: `${name} — ${label.toLowerCase()}`,
    caption: label,
  }));
}

export function therapistPhoto(id: string, name: string): ImageRef {
  return { src: `/images/therapists/${id}.jpg`, alt: name };
}
