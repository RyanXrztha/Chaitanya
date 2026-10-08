/** Single source of truth for the clinic's public contact details. */
export const CLINIC = {
  name: "Chaitanya Health & Wellness",
  legalName: "Chaitanya Health & Wellness Pvt. Ltd.",
  phone: { display: "+977-1-5447774", tel: "+97715447774" },
  mobile: { display: "+977-9801132922", tel: "+9779801132922" },
  email: "info@chaitanyawellness.com.np",
  address: "Bakhundole, Lalitpur 44700, Nepal",
  shortAddress: "Bakhundole, Lalitpur",
  mapCode: "M8M8+5G",
  hours: "8 AM – 8 PM",
  openingHours: "8:00 AM – 8:00 PM",
  bookingNotice: "1-day prior booking required",
  map: {
    directions: "https://www.google.com/maps/search/?api=1&query=Bakhundole+Lalitpur+44700+Nepal",
    embed: `https://www.google.com/maps?q=${encodeURIComponent("Chaitanya - Health & Wellness, Bakhundol, Lalitpur, Bagmati Province 44600")}&z=17&output=embed`,
    streetView: "https://www.google.com/maps?layer=c&cbll=27.6862,85.3139&cbp=12,90,0,0,0&output=svembed",
  },
  /** IANA zone used for "today" in bookings and review dates. */
  timeZone: "Asia/Kathmandu",
} as const;

export const mailto = (subject?: string) =>
  subject ? `mailto:${CLINIC.email}?subject=${encodeURIComponent(subject)}` : `mailto:${CLINIC.email}`;

/** Today's date at the clinic (YYYY-MM-DD), independent of server/visitor time zone. */
export function clinicTodayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
