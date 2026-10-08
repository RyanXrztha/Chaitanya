import type { ReviewRepository } from "@/domain";
import { REVIEWS, REVIEW_STATS } from "../data/reviews.data";

export class StaticReviewRepository implements ReviewRepository {
  async list() {
    return REVIEWS;
  }

  async stats() {
    return REVIEW_STATS;
  }
}
