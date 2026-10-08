import type { Booking, BookingRepository } from "@/domain";

/**
 * Stores bookings in process memory — there is no backend yet. Swap for an API- or
 * database-backed implementation in the container; nothing else changes.
 */
export class InMemoryBookingRepository implements BookingRepository {
  private readonly bookings = new Map<string, Booking>();

  async save(data: Omit<Booking, "reference" | "issuedAt">): Promise<Booking> {
    let reference: string;
    do {
      reference = `CHY-${String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")}`;
    } while (this.bookings.has(reference));
    const booking: Booking = { ...data, reference, issuedAt: new Date() };
    this.bookings.set(reference, booking);
    return booking;
  }

  async findByReference(reference: string) {
    return this.bookings.get(reference) ?? null;
  }
}
