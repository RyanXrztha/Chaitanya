import type { CalendarDate } from "../value-objects/CalendarDate";
import type { Npr } from "../value-objects/Money";
import type { TimeSlot } from "../value-objects/TimeSlot";
import type { CustomerDetails } from "./Customer";
import type { PaymentMethodId } from "./Payment";
import type { TherapistId } from "./Therapist";

/**
 * "therapist": the guest picks a therapist first (modal), then only that therapist's
 * free dates/times are selectable. "availability": the guest picks a date & time
 * first, then chooses among therapists free at that slot.
 */
export type BookingFlow = "therapist" | "availability";

export type BookingStepKey = "datetime" | "therapist" | "details" | "payment";

export const BOOKING_STEP_LABELS: Record<BookingStepKey, string> = {
  datetime: "Date & Time",
  therapist: "Therapist",
  details: "Details",
  payment: "Payment",
};

export const BOOKING_STEP_TITLES: Record<BookingStepKey, string> = {
  datetime: "Choose Date & Time",
  therapist: "Choose Your Therapist",
  details: "Your Details",
  payment: "Payment",
};

/** Ordered steps for a flow (the final "Booked" state is not a step). */
export function bookingSteps(flow: BookingFlow): BookingStepKey[] {
  return flow === "availability"
    ? ["datetime", "therapist", "details", "payment"]
    : ["datetime", "details", "payment"];
}

export interface BookingRequest {
  serviceId: number;
  /** Selected duration option, in minutes. */
  durationMinutes: number;
  flow: BookingFlow;
  date: CalendarDate;
  time: TimeSlot;
  /** A therapist id, or ANY_THERAPIST_ID. */
  therapistId: TherapistId;
  customer: CustomerDetails;
  paymentMethodId: PaymentMethodId;
}

export type BookingStatus = "paid" | "confirmed-pay-at-clinic";

export interface Booking extends BookingRequest {
  /** e.g. "CHY-482913" */
  reference: string;
  serviceName: string;
  serviceCategory: string;
  durationLabel: string;
  therapistName: string | null;
  amount: Npr;
  status: BookingStatus;
  issuedAt: Date;
}
