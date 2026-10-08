import type { ImageRef } from "../value-objects/Image";
import type { TimeSlot } from "../value-objects/TimeSlot";
import { WEEKDAY_SHORT, type Weekday } from "../value-objects/CalendarDate";

export type TherapistId = string;

/** Sentinel id for "No preference — we will assign for you". */
export const ANY_THERAPIST_ID = "any";

export interface Therapist {
  id: TherapistId;
  name: string;
  role: string;
  initials: string;
  /** Weekdays the therapist normally works. */
  workingDays: Weekday[];
  /** Start times the therapist normally takes. */
  timeSlots: TimeSlot[];
  photo: ImageRef | null;
}

export function isAnyTherapist(t: Pick<Therapist, "id"> | null | undefined): boolean {
  return t?.id === ANY_THERAPIST_ID;
}

/** "Available Mon, Tue, Wed" */
export function workingDaysLabel(t: Therapist): string {
  return "Available " + t.workingDays.map((d) => WEEKDAY_SHORT[d]).join(", ");
}

/** Last two words of the name, e.g. "Dr. Anjali Sharma" → "Anjali Sharma". */
export function shortName(t: Therapist): string {
  return t.name.split(" ").slice(-2).join(" ");
}
