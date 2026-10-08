export const CONTACT_SUBJECTS = ["General Enquiry", "Booking Question", "Membership", "Feedback", "Careers"] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export function isContactSubject(s: string): s is ContactSubject {
  return (CONTACT_SUBJECTS as readonly string[]).includes(s);
}

/** "Send us a message" on the Contact page. */
export interface ContactMessageRequest {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  /** e.g. "CHY-M48213" */
  reference: string;
  name: string;
  phone: string;
  email?: string;
  subject: ContactSubject;
  message: string;
  receivedAt: Date;
}

export const MAX_MESSAGE_LENGTH = 2000;
