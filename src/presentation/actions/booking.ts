"use server";

import {
  isNotFoundError,
  isValidationError,
  parseIsoDate,
  type BookingFlow,
  type BookingStatus,
  type PaymentMethodId,
  type TimeSlot,
} from "@/domain";
import { container } from "@/infrastructure/container";

export interface BookingDraftInput {
  serviceId: number;
  durationMinutes: number;
  flow: BookingFlow;
  /** ISO YYYY-MM-DD */
  date: string;
  time: TimeSlot;
  therapistId: string;
  paymentMethodId: PaymentMethodId;
  customer: { name: string; phone: string; email?: string; notes?: string };
}

/** Plain, serialisable confirmation for the client (ticket + invoice). */
export interface BookingReceipt {
  reference: string;
  serviceName: string;
  serviceCategory: string;
  durationLabel: string;
  therapistName: string | null;
  date: string;
  time: TimeSlot;
  amount: number;
  status: BookingStatus;
  paymentMethodId: PaymentMethodId;
  customer: { name: string; phone: string; email?: string; notes?: string };
  issuedAt: string;
}

export type SubmitBookingResult = { ok: true; booking: BookingReceipt } | { ok: false; message: string; field?: string };

export async function submitBookingAction(input: BookingDraftInput): Promise<SubmitBookingResult> {
  const date = parseIsoDate(input.date);
  if (!date) return { ok: false, message: "Please select a date and time to continue.", field: "datetime" };
  try {
    const b = await container.submitBooking.execute({ ...input, date });
    return {
      ok: true,
      booking: {
        reference: b.reference,
        serviceName: b.serviceName,
        serviceCategory: b.serviceCategory,
        durationLabel: b.durationLabel,
        therapistName: b.therapistName,
        date: input.date,
        time: b.time,
        amount: b.amount,
        status: b.status,
        paymentMethodId: b.paymentMethodId,
        customer: b.customer,
        issuedAt: b.issuedAt.toISOString(),
      },
    };
  } catch (e) {
    if (isValidationError(e)) return { ok: false, message: e.message, field: e.field };
    if (isNotFoundError(e)) return { ok: false, message: "That treatment is no longer available." };
    console.error("submitBookingAction failed", e);
    return { ok: false, message: "We couldn’t confirm your booking. Please try again or call us." };
  }
}
