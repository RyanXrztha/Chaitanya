"use server";

import { isValidationError } from "@/domain";
import { container } from "@/infrastructure/container";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success"; name: string; reference: string }
  | { status: "error"; message: string; field?: string };

const text = (d: FormData, k: string) => String(d.get(k) ?? "");

/** Server action behind the Contact page "Send us a message" form. */
export async function sendContactMessageAction(_prev: ContactFormState, data: FormData): Promise<ContactFormState> {
  try {
    const message = await container.sendContactMessage.execute({
      name: text(data, "name"),
      phone: text(data, "phone"),
      email: text(data, "email"),
      subject: text(data, "subject"),
      message: text(data, "message"),
    });
    return { status: "success", name: message.name, reference: message.reference };
  } catch (e) {
    if (isValidationError(e)) return { status: "error", message: e.message, field: e.field };
    console.error("sendContactMessageAction failed", e);
    return { status: "error", message: "Something went wrong. Please try again or call us." };
  }
}
