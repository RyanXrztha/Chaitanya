import type { CalendarDate } from "../value-objects/CalendarDate";

/** A "Have questions or want to visit?" request; staff follow up to confirm. */
export interface EnquiryRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Treatment or category the guest is interested in. */
  treatment: string;
  location?: string;
  preferredDate?: CalendarDate | null;
  message?: string;
}

export interface Enquiry extends EnquiryRequest {
  /** e.g. "CHY-E48213" */
  reference: string;
  receivedAt: Date;
}
