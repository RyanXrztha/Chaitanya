import { describe, expect, it } from "vitest";
import { daysBetween, formatDaysAgo } from "@/domain/value-objects/CalendarDate";

describe("relative dates", () => {
  it("counts whole days across month, year and DST boundaries", () => {
    expect(daysBetween({ year: 2026, month: 9, day: 4 }, { year: 2026, month: 9, day: 6 })).toBe(2);
    expect(daysBetween({ year: 2026, month: 8, day: 6 }, { year: 2026, month: 9, day: 6 })).toBe(30);
    expect(daysBetween({ year: 2025, month: 11, day: 31 }, { year: 2026, month: 0, day: 1 })).toBe(1);
    expect(daysBetween({ year: 2026, month: 2, day: 1 }, { year: 2026, month: 3, day: 1 })).toBe(31);
    expect(daysBetween({ year: 2026, month: 9, day: 6 }, { year: 2026, month: 9, day: 4 })).toBe(-2);
  });

  it("labels like the prototype's review wall", () => {
    expect([0, 1, 2, 6, 7, 13, 14, 21, 30, 59, 400].map(formatDaysAgo)).toEqual([
      "Today",
      "Yesterday",
      "2 days ago",
      "6 days ago",
      "1 week ago",
      "1 week ago",
      "2 weeks ago",
      "3 weeks ago",
      "1 month ago",
      "1 month ago",
      "1 year ago",
    ]);
  });
});
