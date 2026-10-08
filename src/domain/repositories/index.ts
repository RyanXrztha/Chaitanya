import type { Account } from "../entities/Account";
import type { Booking, BookingRequest } from "../entities/Booking";
import type { Enquiry } from "../entities/Enquiry";
import type { Order, OrderRequest } from "../entities/Order";
import type { Product, ProductGroup, ProductSize } from "../entities/Product";
import type { ContactMessage } from "../entities/ContactMessage";
import type { MembershipTier } from "../entities/Membership";
import type { Review, ReviewStats, ReviewSubmission } from "../entities/Review";
import type { SearchEntry } from "../entities/SearchEntry";
import type { Service, ServiceCategory } from "../entities/Service";
import type { Therapist, TherapistId } from "../entities/Therapist";
import type { CalendarDate } from "../value-objects/CalendarDate";
import type { TimeSlot } from "../value-objects/TimeSlot";

// Ports implemented by the infrastructure layer. All async so a real API or
// database can replace the in-memory implementations without touching use cases.

export interface ServiceRepository {
  listCategories(): Promise<ServiceCategory[]>;
  listServices(): Promise<Service[]>;
  findById(id: number): Promise<Service | null>;
  findBySlug(slug: string): Promise<Service | null>;
}

export interface ProductRepository {
  listGroups(): Promise<ProductGroup[]>;
  listProducts(): Promise<Product[]>;
  listSizes(): Promise<ProductSize[]>;
  findById(id: number): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
}

export interface TherapistRepository {
  /** Real therapists, excluding the "no preference" option. */
  list(): Promise<Therapist[]>;
  /** The "No preference — we will assign for you" pseudo-therapist. */
  anyTherapist(): Promise<Therapist>;
  findById(id: TherapistId): Promise<Therapist | null>;
}

/** Schedule source for therapists (rotas, leave, existing bookings). */
export interface AvailabilityRepository {
  isDayAvailable(therapist: Therapist, date: CalendarDate): boolean;
  isSlotAvailable(therapist: Therapist, date: CalendarDate, time: TimeSlot): boolean;
}

export interface BookingRepository {
  save(booking: Omit<Booking, "reference" | "issuedAt">): Promise<Booking>;
  findByReference(reference: string): Promise<Booking | null>;
}

export interface OrderRepository {
  save(order: Omit<Order, "reference" | "placedAt">): Promise<Order>;
}

/** Credential store. Identifiers are an email address or a phone number. */
export interface AuthRepository {
  verify(identifier: string, password: string): Promise<Account | null>;
  exists(identifier: string): Promise<boolean>;
  create(account: Omit<Account, "id">, password: string): Promise<Account>;
}

export interface ReviewRepository {
  list(): Promise<Review[]>;
  /** Published aggregate rating across review platforms. */
  stats(): Promise<ReviewStats>;
}

/** Reviews left on the site; stored for moderation before they are published. */
export interface ReviewSubmissionRepository {
  save(submission: Omit<ReviewSubmission, "reference" | "receivedAt">): Promise<ReviewSubmission>;
}

export interface ContactMessageRepository {
  save(message: Omit<ContactMessage, "reference" | "receivedAt">): Promise<ContactMessage>;
}

export interface MembershipRepository {
  listTiers(): Promise<MembershipTier[]>;
}

export interface EnquiryRepository {
  save(enquiry: Omit<Enquiry, "reference" | "receivedAt">): Promise<Enquiry>;
}

/** Supplies the static (non-catalogue) entries of the site search, e.g. pages. */
export interface PageIndexRepository {
  listPages(): Promise<SearchEntry[]>;
}

export type { BookingRequest, OrderRequest };
