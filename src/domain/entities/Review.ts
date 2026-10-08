import type { ImageRef } from "../value-objects/Image";

export type Rating = 1 | 2 | 3 | 4 | 5;

export const REVIEW_SOURCES = ["Google Review", "Tripadvisor", "Facebook"] as const;
export type ReviewSource = (typeof REVIEW_SOURCES)[number];

/** A guest review / testimonial. */
export interface Review {
  id: string;
  author: string;
  /** e.g. "Wellness Client", "Member". */
  role: string;
  rating: Rating;
  quote: string;
  avatar: ImageRef | null;
  /** Shown in the home page testimonials marquee. */
  featured: boolean;
  /** Where the review was published; set for the public reviews wall. */
  source?: ReviewSource;
  /** Publication date, ISO "YYYY-MM-DD". */
  postedOn?: string;
}

export function isRating(n: unknown): n is Rating {
  return Number.isInteger(n) && (n as number) >= 1 && (n as number) <= 5;
}

/** Aggregate rating across every platform, as published by the clinic. */
export interface ReviewStats {
  average: number;
  count: number;
  /** Share of reviews per star level, 5 → 1, in whole percent. */
  distribution: { stars: Rating; percent: number }[];
  platforms: { name: string; score: number }[];
}

/** "Share Your Experience" — a review left on the site, held for moderation. */
export interface ReviewSubmissionRequest {
  name: string;
  email?: string;
  rating: number;
  text?: string;
}

export interface ReviewSubmission {
  reference: string;
  name: string;
  email?: string;
  rating: Rating;
  text?: string;
  receivedAt: Date;
}

export const MAX_REVIEW_LENGTH = 2000;
