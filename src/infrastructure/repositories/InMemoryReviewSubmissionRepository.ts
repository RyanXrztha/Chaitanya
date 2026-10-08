import type { ReviewSubmission, ReviewSubmissionRepository } from "@/domain";
import { uniqueReference } from "./reference";

/** Process-memory moderation queue for reviews left on the site. */
export class InMemoryReviewSubmissionRepository implements ReviewSubmissionRepository {
  private readonly submissions = new Map<string, ReviewSubmission>();

  async save(data: Omit<ReviewSubmission, "reference" | "receivedAt">): Promise<ReviewSubmission> {
    const submission: ReviewSubmission = { ...data, reference: uniqueReference("R", this.submissions), receivedAt: new Date() };
    this.submissions.set(submission.reference, submission);
    return submission;
  }
}
