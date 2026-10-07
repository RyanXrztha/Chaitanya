/** Session length in minutes. */
export type Minutes = number;

/** Compact label used by duration filters: 45 → "45 min", 90 → "1 hr 30 min", 120 → "2 hrs". */
export function formatMinutes(m: Minutes): string {
  if (m < 60) return `${m} min`;
  const hrs = Math.floor(m / 60);
  const rest = m % 60;
  return `${hrs} hr${m >= 120 ? "s" : ""}${rest ? ` ${rest} min` : ""}`;
}
