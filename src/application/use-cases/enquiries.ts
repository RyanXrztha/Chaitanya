import {
  ValidationError,
  compareDates,
  fromJsDate,
  type Enquiry,
  type EnquiryRepository,
  type EnquiryRequest,
} from "@/domain";
import type { Clock } from "./booking";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "Have questions or want to visit?" — validates and records an enquiry. */
export class SubmitEnquiryUseCase {
  constructor(
    private readonly enquiries: EnquiryRepository,
    private readonly now: Clock = () => new Date(),
  ) {}

  async execute(req: EnquiryRequest): Promise<Enquiry> {
    const firstName = req.firstName.trim();
    const lastName = req.lastName.trim();
    const email = req.email.trim();
    const phone = req.phone.trim();
    const treatment = req.treatment.trim();

    if (!firstName) throw new ValidationError("Please enter your first name.", "firstName");
    if (!lastName) throw new ValidationError("Please enter your last name.", "lastName");
    if (!EMAIL.test(email)) throw new ValidationError("Please enter a valid email address.", "email");
    if (!phone) throw new ValidationError("Please enter your phone number.", "phone");
    if (!treatment) throw new ValidationError("Please select a treatment.", "treatment");
    if (req.preferredDate && compareDates(req.preferredDate, fromJsDate(this.now())) < 0) {
      throw new ValidationError("Please choose a date that is not in the past.", "preferredDate");
    }

    return this.enquiries.save({
      firstName,
      lastName,
      email,
      phone,
      treatment,
      location: req.location?.trim() || undefined,
      preferredDate: req.preferredDate ?? null,
      message: req.message?.trim() || undefined,
    });
  }
}
