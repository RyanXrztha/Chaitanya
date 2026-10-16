// Copy for the About Us page (AboutUs.dc.html).

export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

/** "Chaitanya By The Numbers". Verified Reviews is filled from the review stats at render time. */
export function aboutStats(reviewCount: number): AboutStat[] {
  return [
    {
      value: 15,
      suffix: "+",
      label: "Years of Practice",
      desc: "Continuous operation in Bakhundole, refining protocols across generations of patients.",
    },
    {
      value: 25000,
      suffix: "+",
      label: "Guests Treated",
      desc: "Each guest receives a plan built around their own constitution, not a fixed menu.",
    },
    {
      value: reviewCount,
      suffix: "",
      label: "Verified Reviews",
      desc: "Patient feedback shapes how our therapists and physicians work together, visit after visit.",
    },
    {
      value: 12,
      suffix: "",
      label: "Physicians & Therapists",
      desc: "A small, BAMS-qualified team closely involved in every case, not a rotating roster.",
    },
  ];
}

export const ABOUT_VALUES = [
  {
    title: "Personalized Care",
    desc: "No two constitutions are the same, so no two treatment plans should be either. Every visit begins with a thorough dosha assessment that looks at your body, lifestyle, and history before a single herb or therapy is ever prescribed.",
    image: { src: "/images/slots/value-1.webp", alt: "Therapist giving a calming head and face massage" },
  },
  {
    title: "Clinical Rigor",
    desc: "Our BAMS-qualified physicians hold to the discipline of classical Ayurvedic texts while pairing it with modern diagnostics, so tradition and clinical evidence work together rather than in isolation.",
    image: { src: "/images/slots/value-2.webp", alt: "Physicians and therapists reviewing a case together" },
  },
  {
    title: "Warm Hospitality",
    desc: "From the moment you arrive, every detail of the space is considered — quiet corners, unhurried pacing, and a team that treats your comfort as seriously as your treatment plan, so real rest is possible.",
    image: { src: "/images/slots/value-3.webp", alt: "Guest resting in a quiet lounge chair" },
  },
  {
    title: "Community First",
    desc: "Our packages are built around the conditions our community actually lives with — arthritis, migraines, stress, insomnia — not seasonal trends, so care stays relevant long after your first visit.",
    image: { src: "/images/photos/spa-tea-robes.jpg", alt: "Two guests in robes sharing herbal tea" },
  },
];
