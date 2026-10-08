import type { ContactMessage, ContactMessageRepository } from "@/domain";
import { uniqueReference } from "./reference";

/** Process-memory inbox for the Contact page (no email / helpdesk integration yet). */
export class InMemoryContactMessageRepository implements ContactMessageRepository {
  private readonly messages = new Map<string, ContactMessage>();

  async save(data: Omit<ContactMessage, "reference" | "receivedAt">): Promise<ContactMessage> {
    const message: ContactMessage = { ...data, reference: uniqueReference("M", this.messages), receivedAt: new Date() };
    this.messages.set(message.reference, message);
    return message;
  }
}
