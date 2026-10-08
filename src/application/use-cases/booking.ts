import {
  ANY_THERAPIST_ID,
  BOOKING_PAYMENT_METHODS,
  NotFoundError,
  PAYMENT_METHODS,
  TIME_SLOTS,
  ValidationError,
  compareDates,
  daysInMonth,
  fromJsDate,
  isTimeSlot,
  weekdayOf,
  type AvailabilityRepository,
  type Booking,
  type BookingFlow,
  type BookingRepository,
  type BookingRequest,
  type BookingStepKey,
  type CalendarDate,
  type PaymentMethodId,
  type ServiceRepository,
  type Therapist,
  type TherapistRepository,
  type TimeSlot,
} from "@/domain";

/** How many years ahead the calendar's Year select offers. */
export const BOOKING_YEARS_AHEAD = 2;

export interface TherapistRoster {
  therapists: Therapist[];
  anyTherapist: Therapist;
}

export class GetTherapistsUseCase {
  constructor(private readonly therapists: TherapistRepository) {}

  async execute(): Promise<TherapistRoster> {
    const [therapists, anyTherapist] = await Promise.all([this.therapists.list(), this.therapists.anyTherapist()]);
    return { therapists, anyTherapist };
  }
}

export type CalendarCell =
  | { kind: "blank" }
  /** Leading days of the next month that pad the last week (shown greyed). */
  | { kind: "outside"; day: number }
  | {
      kind: "day";
      date: CalendarDate;
      isPast: boolean;
      /** The locked therapist does not work / is off that day. */
      isUnavailable: boolean;
      isWeekend: boolean;
    };

export interface TimeOption {
  time: TimeSlot;
  available: boolean;
}

export interface TherapistOption {
  therapist: Therapist;
  /** Free at the chosen date & time (always true until both are chosen). */
  available: boolean;
}

/**
 * Pure availability queries behind the booking calendar. Synchronous so the
 * calendar can re-render on every click without async state.
 */
export class GetBookingAvailabilityUseCase {
  constructor(private readonly availability: AvailabilityRepository) {}

  /** Month grid, Sunday-first, padded to whole weeks. */
  monthGrid(year: number, month: number, today: CalendarDate, lockedTherapist: Therapist | null): CalendarCell[] {
    const cells: CalendarCell[] = [];
    const firstDow = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDow; i++) cells.push({ kind: "blank" });
    for (let day = 1; day <= daysInMonth(year, month); day++) {
      const date = { year, month, day };
      const isPast = compareDates(date, today) < 0;
      const dow = weekdayOf(date);
      cells.push({
        kind: "day",
        date,
        isPast,
        isUnavailable: !isPast && !!lockedTherapist && !this.availability.isDayAvailable(lockedTherapist, date),
        isWeekend: dow === 0 || dow === 6,
      });
    }
    let next = 1;
    while (cells.length % 7 !== 0) cells.push({ kind: "outside", day: next++ });
    return cells;
  }

  /** Every slot is open unless a therapist is locked in, in which case only their free slots are. */
  timeOptions(date: CalendarDate | null, lockedTherapist: Therapist | null): TimeOption[] {
    return TIME_SLOTS.map((time) => ({
      time,
      available: !lockedTherapist || (!!date && this.availability.isSlotAvailable(lockedTherapist, date, time)),
    }));
  }

  therapistOptions(therapists: Therapist[], date: CalendarDate | null, time: TimeSlot | null): TherapistOption[] {
    return therapists.map((therapist) => ({
      therapist,
      available: !date || !time || this.availability.isSlotAvailable(therapist, date, time),
    }));
  }

  /** Years offered by the calendar's Year select. */
  yearOptions(today: CalendarDate): number[] {
    return Array.from({ length: BOOKING_YEARS_AHEAD + 1 }, (_, i) => today.year + i);
  }

  /** Clamp a (year, month) view so it never goes before the current month. */
  clampView(year: number, month: number, today: CalendarDate): { year: number; month: number } {
    const offset = (year - today.year) * 12 + (month - today.month);
    if (offset >= 0) return { year, month };
    return { year: today.year, month: today.month };
  }
}

/** A booking being assembled step by step in the UI. */
export interface BookingDraft {
  flow: BookingFlow;
  date: CalendarDate | null;
  time: TimeSlot | null;
  therapistId: string | null;
  paymentMethodId: PaymentMethodId | null;
}

/**
 * The message shown when "Next" is pressed on an incomplete step, or "" when the
 * step is complete. Details are validated by the form's required fields.
 */
export function missingForStep(step: BookingStepKey, draft: BookingDraft): string {
  switch (step) {
    case "datetime":
      if (!draft.date && !draft.time) return "Please select a date and time to continue.";
      if (!draft.date) return "Please select a date to continue.";
      if (!draft.time) return "Please select a time to continue.";
      return "";
    case "therapist":
      return draft.therapistId ? "" : "Please choose a therapist to continue.";
    case "payment":
      return draft.paymentMethodId ? "" : "Please choose a payment method to continue.";
    case "details":
      return "";
  }
}

export type Clock = () => Date;

/** Validates a complete booking against the catalogue and schedule, then records it. */
export class SubmitBookingUseCase {
  constructor(
    private readonly services: ServiceRepository,
    private readonly therapists: TherapistRepository,
    private readonly availability: AvailabilityRepository,
    private readonly bookings: BookingRepository,
    private readonly now: Clock = () => new Date(),
  ) {}

  async execute(req: BookingRequest): Promise<Booking> {
    const service = await this.services.findById(req.serviceId);
    if (!service) throw new NotFoundError("Service", req.serviceId);
    const duration = service.durations.find((d) => d.minutes === req.durationMinutes);
    if (!duration) throw new ValidationError("Please choose a valid duration.", "duration");

    if (!req.date || !isTimeSlot(req.time)) throw new ValidationError("Please select a date and time to continue.", "datetime");
    if (compareDates(req.date, fromJsDate(this.now())) < 0) {
      throw new ValidationError("Please choose a date that is not in the past.", "datetime");
    }

    const therapist =
      req.therapistId === ANY_THERAPIST_ID
        ? await this.therapists.anyTherapist()
        : await this.therapists.findById(req.therapistId);
    if (!therapist) throw new ValidationError("Please choose a therapist to continue.", "therapist");
    if (req.flow === "therapist" && therapist.id === ANY_THERAPIST_ID) {
      throw new ValidationError("Please choose a therapist to continue.", "therapist");
    }
    if (!this.availability.isSlotAvailable(therapist, req.date, req.time)) {
      throw new ValidationError(`${therapist.name} is not available at that time. Please pick another slot.`, "datetime");
    }

    const name = req.customer.name.trim();
    const phone = req.customer.phone.trim();
    if (!name) throw new ValidationError("Please enter your full name.", "name");
    if (!phone) throw new ValidationError("Please enter your phone number.", "phone");
    const email = req.customer.email?.trim() || undefined;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError("Please enter a valid email address.", "email");
    }

    if (!BOOKING_PAYMENT_METHODS.includes(req.paymentMethodId)) {
      throw new ValidationError("Please choose a payment method to continue.", "payment");
    }
    const payment = PAYMENT_METHODS[req.paymentMethodId];

    return this.bookings.save({
      ...req,
      customer: { name, phone, email, notes: req.customer.notes?.trim() || undefined },
      serviceName: service.name,
      serviceCategory: service.categoryLabel,
      durationLabel: duration.label,
      therapistName: therapist.id === ANY_THERAPIST_ID ? null : therapist.name,
      amount: duration.price,
      status: payment.prepaid ? "paid" : "confirmed-pay-at-clinic",
    });
  }
}
