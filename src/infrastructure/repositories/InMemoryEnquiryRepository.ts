import type { Enquiry, EnquiryRepository } from "@/domain";

/** Process-memory enquiry store (no CRM / email integration yet). */
export class InMemoryEnquiryRepository implements EnquiryRepository {
  private readonly enquiries = new Map<string, Enquiry>();

  async save(data: Omit<Enquiry, "reference" | "receivedAt">): Promise<Enquiry> {
    let reference: string;
    do {
      reference = `CHY-E${String(Math.floor(Math.random() * 100_000)).padStart(5, "0")}`;
    } while (this.enquiries.has(reference));
    const enquiry: Enquiry = { ...data, reference, receivedAt: new Date() };
    this.enquiries.set(reference, enquiry);
    return enquiry;
  }
}
