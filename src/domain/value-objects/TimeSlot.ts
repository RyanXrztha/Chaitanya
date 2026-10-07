/** A bookable start time as shown to guests, e.g. "09:00 AM". */
export type TimeSlot = "09:00 AM" | "12:00 PM" | "02:00 PM" | "04:00 PM" | "06:00 PM" | "08:00 PM";

/** Opening hours are 8 AM – 8 PM; sessions start at these times. */
export const TIME_SLOTS: readonly TimeSlot[] = [
  "09:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

export function isTimeSlot(v: string): v is TimeSlot {
  return (TIME_SLOTS as readonly string[]).includes(v);
}
