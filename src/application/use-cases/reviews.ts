import {
  MAX_REVIEW_LENGTH,
  ValidationError,
  isRating,
  type Review,
  type ReviewRepository,
  type ReviewStats,
  type ReviewSubmission,
  type ReviewSubmissionRepository,
  type ReviewSubmissionRequest,
} from "@/domain";
import { isEmail } from "./validation";

/** Testimonials for the home page marquee. */
export class GetFeaturedReviewsUseCase {
  constructor(private readonly reviews: ReviewRepository) {}

  async execute(): Promise<Review[]> {
    return (await this.reviews.list()).filter((r) => r.featured);
  }
}

/** The public reviews wall: published platform reviews (in curated order) plus the aggregate rating. */
export class GetReviewsUseCase {
  constructor(private readonly reviews: ReviewRepository) {}

  async execute(): Promise<Review[]> {
    return (await this.reviews.list()).filter((r) => r.source && r.postedOn);
  }

  stats(): Promise<ReviewStats> {
    return this.reviews.stats();
  }
}

/** "Share Your Experience" — validated and held for moderation. */
export class SubmitReviewUseCase {
  constructor(private readonly submissions: ReviewSubmissionRepository) {}

  async execute(req: ReviewSubmissionRequest): Promise<ReviewSubmission> {
    const name = req.name.trim();
    const email = req.email?.trim() || undefined;
    const text = req.text?.trim() || undefined;

    if (!name) throw new ValidationError("Please enter your name.", "name");
    if (email && !isEmail(email)) throw new ValidationError("Please enter a valid email address.", "email");
    if (!isRating(req.rating)) throw new ValidationError("Please choose a rating from 1 to 5 stars.", "rating");
    if (text && text.length > MAX_REVIEW_LENGTH) {
      throw new ValidationError(`Please keep your review under ${MAX_REVIEW_LENGTH} characters.`, "text");
    }

    return this.submissions.save({ name, email, rating: req.rating, text });
  }
}
