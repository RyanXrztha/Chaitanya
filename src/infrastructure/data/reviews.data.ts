import type { Review, ReviewStats } from "@/domain";

// Home page testimonials (index.html › feedbackCardsLoop). Avatars are the same
// demo portraits the prototype assigns to slots fb-av-1…6, stored locally.

const avatar = (n: number, name: string) => ({ src: `/images/avatars/fb-av-${n}.jpg`, alt: name });

const TESTIMONIALS: Review[] = [
  {
    id: "fb-1",
    author: "S. Maharjan",
    role: "Wellness Client",
    rating: 5,
    quote: "The Panchakarma retreat reset something in me I didn’t know was off balance. Three months on, I still sleep like I did as a child.",
    avatar: avatar(1, "S. Maharjan"),
    featured: true,
  },
  {
    id: "fb-2",
    author: "R. Karki",
    role: "Regular Guest",
    rating: 5,
    quote: "My physician actually talked to my therapist between sessions. I’ve never felt so looked-after at a clinic.",
    avatar: avatar(2, "R. Karki"),
    featured: true,
  },
  {
    id: "fb-3",
    author: "A. Sharma",
    role: "Founder, Ritof Studio",
    rating: 4,
    quote: "The atmosphere was calm, peaceful, and incredibly welcoming from the moment I walked in — the therapy itself was excellent.",
    avatar: avatar(3, "A. Sharma"),
    featured: true,
  },
  {
    id: "fb-4",
    author: "P. Basnet",
    role: "Wellness Client",
    rating: 5,
    quote: "Shirodhara on a Friday evening is now non-negotiable. Calmest I feel all week.",
    avatar: avatar(4, "P. Basnet"),
    featured: true,
  },
  {
    id: "fb-5",
    author: "A. Thapa",
    role: "Member",
    rating: 4,
    quote: "Every visit feels personal — they remember my constitution, my history, my preferences.",
    avatar: avatar(5, "A. Thapa"),
    featured: true,
  },
  {
    id: "fb-6",
    author: "J. Alison",
    role: "Project Manager",
    rating: 4,
    quote: "Was initially hesitant about the treatment, but the team quickly put my mind at ease. The results exceeded my expectations.",
    avatar: avatar(6, "J. Alison"),
    featured: true,
  },
];

// Reviews page wall (Reviews.dc.html › reviews). Dates are when each review was
// published; the page shows them relative to today ("3 days ago").
const guest = (n: number, name: string) => ({ src: `/images/avatars/rv-${n}.jpg`, alt: name });

const WALL: [string, Review["source"], Review["rating"], string, string][] = [
  ["S. Maharjan", "Google Review", 5, "2026-10-04", "The Panchakarma retreat reset something in me I didn’t know was off balance. Three months on, I still sleep like I did as a child."],
  ["R. Karki", "Tripadvisor", 5, "2026-09-29", "My physician actually talked to my therapist between sessions. I’ve never felt so looked-after at a clinic."],
  ["A. Sharma", "Google Review", 4, "2026-10-03", "The atmosphere was calm, peaceful and welcoming from the moment I walked in. Highly recommend the Shirodhara."],
  ["P. Basnet", "Facebook", 5, "2026-09-22", "Shirodhara on a Friday evening is now non-negotiable. Calmest I feel all week."],
  ["A. Thapa", "Google Review", 4, "2026-10-01", "Every visit feels personal — they remember my constitution, my history, my preferences."],
  ["J. Alison", "Tripadvisor", 4, "2026-09-06", "Was initially hesitant about the treatment, but the team quickly put my mind at ease. Results exceeded expectations."],
  ["M. Shrestha", "Google Review", 5, "2026-10-02", "The hot stone massage melted a week of desk tension. Spotless rooms and the herbal tea after was a lovely touch."],
  ["K. Tamang", "Facebook", 5, "2026-09-29", "Booked the couples package for our anniversary. Unhurried, warm and genuinely restorative for both of us."],
  ["L. Chen", "Tripadvisor", 5, "2026-09-30", "A calm oasis in Kathmandu. The therapist explained every step of the Abhyanga and adjusted pressure perfectly."],
  ["N. Rai", "Google Review", 4, "2026-09-15", "Their diet consultation was practical, not preachy. Small changes, and my digestion has never been better."],
  ["D. Gurung", "Google Review", 5, "2026-09-22", "Membership has been worth every rupee. Priority booking means I never miss my monthly Shirodhara."],
  ["E. Müller", "Tripadvisor", 5, "2026-09-06", "Came for one facial, stayed for three sessions. Friendly staff and a beautifully peaceful space."],
];

export const REVIEWS: Review[] = [
  ...TESTIMONIALS,
  ...WALL.map(([author, source, rating, postedOn, quote], i): Review => ({
    id: `rv-${i + 1}`,
    author,
    role: "Verified Guest",
    rating,
    quote,
    avatar: guest(i + 1, author),
    featured: false,
    source,
    postedOn,
  })),
];

/** Published aggregate across Google, Tripadvisor and Facebook. */
export const REVIEW_STATS: ReviewStats = {
  average: 4.8,
  count: 787,
  distribution: [
    { stars: 5, percent: 78 },
    { stars: 4, percent: 14 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 2 },
    { stars: 1, percent: 1 },
  ],
  platforms: [
    { name: "Google", score: 4.9 },
    { name: "Tripadvisor", score: 4.8 },
    { name: "Facebook", score: 4.7 },
  ],
};
