import {
  MAX_MESSAGE_LENGTH,
  ValidationError,
  isContactSubject,
  type ContactMessage,
  type ContactMessageRepository,
  type ContactMessageRequest,
} from "@/domain";
import { isEmail, isPhone } from "./validation";

/** Contact page "Send us a message". */
export class SendContactMessageUseCase {
  constructor(private readonly messages: ContactMessageRepository) {}

  async execute(req: ContactMessageRequest): Promise<ContactMessage> {
    const name = req.name.trim();
    const phone = req.phone.trim();
    const email = req.email?.trim() || undefined;
    const subject = req.subject.trim();
    const message = req.message.trim();

    if (!name) throw new ValidationError("Please enter your full name.", "name");
    if (!isPhone(phone)) throw new ValidationError("Please enter a valid phone number.", "phone");
    if (email && !isEmail(email)) throw new ValidationError("Please enter a valid email address.", "email");
    if (!isContactSubject(subject)) throw new ValidationError("Please choose a subject.", "subject");
    if (!message) throw new ValidationError("Please write a message.", "message");
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new ValidationError(`Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`, "message");
    }

    return this.messages.save({ name, phone, email, subject, message });
  }
}
