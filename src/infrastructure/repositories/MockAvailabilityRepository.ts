import {
  ANY_THERAPIST_ID,
  toJsDate,
  weekdayOf,
  type AvailabilityRepository,
  type CalendarDate,
  type Therapist,
  type TimeSlot,
} from "@/domain";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Simulated rota, identical to Booking.dc.html: a therapist works their weekly days
 * and times, minus a deterministic ~1-in-6 day off and ~1-in-5 slot already booked.
 * "No preference" is always available. Replace with a scheduling API in production.
 */
export class MockAvailabilityRepository implements AvailabilityRepository {
  isDayAvailable(t: Therapist, date: CalendarDate): boolean {
    return t.workingDays.includes(weekdayOf(date)) && !this.isDayOff(t, date);
  }

  isSlotAvailable(t: Therapist, date: CalendarDate, time: TimeSlot): boolean {
    if (!this.isDayAvailable(t, date) || !t.timeSlots.includes(time)) return false;
    return t.id === ANY_THERAPIST_ID || hash(t.id + toJsDate(date).toDateString() + time) % 5 !== 0;
  }

  private isDayOff(t: Therapist, date: CalendarDate): boolean {
    return t.id !== ANY_THERAPIST_ID && hash(t.id + toJsDate(date).toDateString()) % 6 === 0;
  }
}
