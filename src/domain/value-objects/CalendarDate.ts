/**
 * A timezone-free calendar day. Month is 0-based, matching JS Date, so the
 * booking calendar can map it directly onto a month grid.
 */
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sun … Sat

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export function toJsDate(d: CalendarDate): Date {
  return new Date(d.year, d.month, d.day);
}

export function fromJsDate(d: Date): CalendarDate {
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

export function weekdayOf(d: CalendarDate): Weekday {
  return toJsDate(d).getDay() as Weekday;
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

export function isSameDate(a: CalendarDate | null | undefined, b: CalendarDate | null | undefined): boolean {
  return !!a && !!b && compareDates(a, b) === 0;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** ISO "YYYY-MM-DD" — stable key for URLs, storage and maps. */
export function toIsoDate(d: CalendarDate): string {
  const mm = String(d.month + 1).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

export function parseIsoDate(s: string): CalendarDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) - 1, day: Number(m[3]) };
}

/** "October 6" */
export function formatMonthDay(d: CalendarDate): string {
  return `${MONTH_NAMES[d.month]} ${d.day}`;
}

/** Whole days from `from` to `to` (negative when `to` is earlier). DST-safe. */
export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  return Math.round((Date.UTC(to.year, to.month, to.day) - Date.UTC(from.year, from.month, from.day)) / 86_400_000);
}

/** "Today", "Yesterday", "3 days ago", "2 weeks ago", "1 month ago", "2 years ago". */
export function formatDaysAgo(days: number): string {
  const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"} ago`;
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return unit(days, "day");
  if (days < 30) return unit(Math.floor(days / 7), "week");
  if (days < 365) return unit(Math.floor(days / 30), "month");
  return unit(Math.floor(days / 365), "year");
}
