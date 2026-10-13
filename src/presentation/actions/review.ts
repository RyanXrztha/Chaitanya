"use server";

import { isValidationError } from "@/domain";
import { container } from "@/infrastructure/container";

export type ReviewFormState =
  | { status: "idle" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string; field?: string };

const text = (d: FormData, k: string) => String(d.get(k) ?? "");

/** Server action behind "Share Your Experience" on the Reviews page. */
export async function submitReviewAction(_prev: ReviewFormState, data: FormData): Promise<ReviewFormState> {
  try {
    const submission = await container.submitReview.execute({
      name: text(data, "name"),
      email: text(data, "email"),
      rating: Number(text(data, "rating")),
      text: text(data, "review"),
    });
    return { status: "success", reference: submission.reference };
  } catch (e) {
    if (isValidationError(e)) return { status: "error", message: e.message, field: e.field };
    console.error("submitReviewAction failed", e);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
