"use server";

import { isValidationError, parseIsoDate } from "@/domain";
import { container } from "@/infrastructure/container";

export type EnquiryFormState =
  | { status: "idle" }
  | { status: "success"; firstName: string; reference: string }
  | { status: "error"; message: string; field?: string };

const text = (d: FormData, k: string) => String(d.get(k) ?? "");

/** Server action behind the "Have Questions or Want to Visit?" forms. */
export async function submitEnquiryAction(_prev: EnquiryFormState, data: FormData): Promise<EnquiryFormState> {
  try {
    const date = text(data, "date");
    const enquiry = await container.submitEnquiry.execute({
      firstName: text(data, "firstName"),
      lastName: text(data, "lastName"),
      email: text(data, "email"),
      phone: text(data, "phone"),
      treatment: text(data, "treatment"),
      location: text(data, "location"),
      preferredDate: date ? parseIsoDate(date) : null,
      message: text(data, "message"),
    });
    return { status: "success", firstName: enquiry.firstName, reference: enquiry.reference };
  } catch (e) {
    if (isValidationError(e)) return { status: "error", message: e.message, field: e.field };
    console.error("submitEnquiryAction failed", e);
    return { status: "error", message: "Something went wrong. Please try again or call us." };
  }
}
