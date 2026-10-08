import { beforeEach, describe, expect, it } from "vitest";
import {
  BrowseServicesUseCase,
  GetBookingAvailabilityUseCase,
  GetFeaturedReviewsUseCase,
  GetMembershipTiersUseCase,
  GetReviewsUseCase,
  PlaceOrderUseCase,
  SendContactMessageUseCase,
  SubmitBookingUseCase,
  SubmitEnquiryUseCase,
  SubmitReviewUseCase,
  missingForStep,
  SERVICE_PAGE_SIZE,
} from "@/application";
import {
  ANY_THERAPIST_ID,
  ValidationError,
  bookingSteps,
  formatMinutes,
  formatNpr,
  type BookingRequest,
  type CalendarDate,
} from "@/domain";
import { InMemoryBookingRepository } from "@/infrastructure/repositories/InMemoryBookingRepository";
import { InMemoryContactMessageRepository } from "@/infrastructure/repositories/InMemoryContactMessageRepository";
import { InMemoryReviewSubmissionRepository } from "@/infrastructure/repositories/InMemoryReviewSubmissionRepository";
import { StaticMembershipRepository } from "@/infrastructure/repositories/StaticMembershipRepository";
import { InMemoryEnquiryRepository } from "@/infrastructure/repositories/InMemoryEnquiryRepository";
import { StaticReviewRepository } from "@/infrastructure/repositories/StaticReviewRepository";
import { InMemoryOrderRepository } from "@/infrastructure/repositories/InMemoryOrderRepository";
import { InMemoryProductRepository } from "@/infrastructure/repositories/InMemoryProductRepository";
import { InMemoryServiceRepository } from "@/infrastructure/repositories/InMemoryServiceRepository";
import { InMemoryTherapistRepository } from "@/infrastructure/repositories/InMemoryTherapistRepository";
import { MockAvailabilityRepository } from "@/infrastructure/repositories/MockAvailabilityRepository";

const services = new InMemoryServiceRepository();
const therapists = new InMemoryTherapistRepository();
const availability = new MockAvailabilityRepository();

describe("value objects", () => {
  it("formats rupees with Indian digit grouping", () => {
    expect(formatNpr(4000)).toBe("NPR 4,000");
    expect(formatNpr(125000)).toBe("NPR 1,25,000");
    expect(formatNpr(250, { decimals: true })).toBe("NPR 250.00");
  });

  it("formats durations like the filter chips", () => {
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(60)).toBe("1 hr");
    expect(formatMinutes(75)).toBe("1 hr 15 min");
    expect(formatMinutes(180)).toBe("3 hrs");
  });
});

describe("BrowseServicesUseCase", () => {
  const browse = new BrowseServicesUseCase(services);

  it("defaults to Featured, in featured order", async () => {
    const r = await browse.execute();
    expect(r.category.key).toBe("featured");
    expect(r.total).toBe(12);
    expect(r.items.map((s) => s.featuredRank)).toEqual([...Array(12).keys()]);
  });

  it("scopes packages by tab and hides tabs while searching", async () => {
    const r = await browse.execute({ category: "package", packageTab: "relax" });
    expect(r.items.every((s) => s.packageTab === "relax")).toBe(true);
    expect(r.showPackageTabs).toBe(true);
    expect((await browse.execute({ category: "package", query: "party" })).showPackageTabs).toBe(false);
  });

  it("filters by sub-category, duration and price and reports facets", async () => {
    const r = await browse.execute({ category: "relax", subCategory: "relaxation", durations: [30], priceMax: 2000 });
    expect(r.subCategory?.label).toBe("Relaxation Therapy");
    expect(r.items.length).toBeGreaterThan(0);
    expect(r.items.every((s) => s.durations[0].minutes === 30 && s.durations[0].price <= 2000)).toBe(true);
    expect(r.durationFacets.find((f) => f.minutes === 30)).toMatchObject({ selected: true });
    expect(r.activeFilterCount).toBe(2);
  });

  it("searches all categories when asked", async () => {
    const scoped = await browse.execute({ category: "featured", query: "wax" });
    const all = await browse.execute({ category: "featured", query: "wax", searchAll: true });
    expect(scoped.total).toBe(0);
    expect(all.total).toBeGreaterThan(0);
  });

  it("paginates with Load more", async () => {
    const r = await browse.execute({ category: "beauty" });
    expect(r.items).toHaveLength(SERVICE_PAGE_SIZE);
    expect(r.hasMore).toBe(true);
    const more = await browse.execute({ category: "beauty", limit: SERVICE_PAGE_SIZE * 2 });
    expect(more.hasMore).toBe(false);
  });
});

describe("booking", () => {
  const today: CalendarDate = { year: 2026, month: 9, day: 6 }; // Tue 6 Oct 2026
  const now = () => new Date(2026, 9, 6, 10);
  let bookings: InMemoryBookingRepository;
  let submit: SubmitBookingUseCase;

  beforeEach(() => {
    bookings = new InMemoryBookingRepository();
    submit = new SubmitBookingUseCase(services, therapists, availability, bookings, now);
  });

  const request = (over: Partial<BookingRequest> = {}): BookingRequest => ({
    serviceId: 2480,
    durationMinutes: 60,
    flow: "availability",
    date: { year: 2026, month: 9, day: 8 },
    time: "02:00 PM",
    therapistId: ANY_THERAPIST_ID,
    customer: { name: "  Aarav Shrestha ", phone: "+977 9800000000" },
    paymentMethodId: "esewa",
    ...over,
  });

  it("has flow-specific step sequences", () => {
    expect(bookingSteps("therapist")).toEqual(["datetime", "details", "payment"]);
    expect(bookingSteps("availability")).toEqual(["datetime", "therapist", "details", "payment"]);
  });

  it("reports what is missing on each step", () => {
    const draft = { flow: "availability" as const, date: null, time: null, therapistId: null, paymentMethodId: null };
    expect(missingForStep("datetime", draft)).toBe("Please select a date and time to continue.");
    expect(missingForStep("datetime", { ...draft, date: today })).toBe("Please select a time to continue.");
    expect(missingForStep("therapist", draft)).toBe("Please choose a therapist to continue.");
    expect(missingForStep("payment", { ...draft, paymentMethodId: "esewa" })).toBe("");
  });

  it("builds a Sunday-first month grid padded to whole weeks", () => {
    const uc = new GetBookingAvailabilityUseCase(availability);
    const cells = uc.monthGrid(2026, 9, today, null);
    expect(cells.length % 7).toBe(0);
    expect(cells.slice(0, 4).every((c) => c.kind === "blank")).toBe(true); // 1 Oct 2026 is a Thursday
    const day5 = cells.find((c) => c.kind === "day" && c.date.day === 5);
    expect(day5).toMatchObject({ isPast: true });
    expect(uc.clampView(2026, 8, today)).toEqual({ year: 2026, month: 9 });
  });

  it("records a valid booking with price and payment status", async () => {
    const b = await submit.execute(request());
    expect(b.reference).toMatch(/^CHY-\d{6}$/);
    expect(b).toMatchObject({ amount: 4000, status: "paid", therapistName: null, durationLabel: "60 mins" });
    expect(b.customer.name).toBe("Aarav Shrestha");
    expect(await bookings.findByReference(b.reference)).toEqual(b);
  });

  it("marks pay-at-clinic bookings as due", async () => {
    const b = await submit.execute(request({ paymentMethodId: "cash-at-clinic" }));
    expect(b.status).toBe("confirmed-pay-at-clinic");
  });

  it("rejects past dates, unavailable slots and missing details", async () => {
    await expect(submit.execute(request({ date: { year: 2026, month: 9, day: 1 } }))).rejects.toThrow(ValidationError);
    // Dr. Anjali Sharma does not work Sundays (11 Oct 2026).
    await expect(
      submit.execute(request({ flow: "therapist", therapistId: "as", date: { year: 2026, month: 9, day: 11 } })),
    ).rejects.toThrow(/not available/);
    await expect(submit.execute(request({ flow: "therapist" }))).rejects.toThrow(/therapist/);
    await expect(submit.execute(request({ customer: { name: "", phone: "1" } }))).rejects.toMatchObject({ field: "name" });
    await expect(submit.execute(request({ paymentMethodId: "cash-on-delivery" }))).rejects.toMatchObject({
      field: "payment",
    });
  });
});

describe("PlaceOrderUseCase", () => {
  const place = new PlaceOrderUseCase(new InMemoryProductRepository(), new InMemoryOrderRepository());
  const customer = { name: "Sita", phone: "9800000000", address: "Bakhundol, Lalitpur" };

  it("prices lines by pack size and totals the order", async () => {
    const o = await place.execute({
      lines: [
        { productId: 1, sizeIndex: 1, quantity: 2 }, // 250 g → 550 each
        { productId: 6, sizeIndex: 0, quantity: 1 },
      ],
      customer,
      paymentMethodId: "cash-on-delivery",
    });
    expect(o.reference).toMatch(/^CHY-P\d{5}$/);
    expect(o.lines[0]).toMatchObject({ unitPrice: 550, lineTotal: 1100, sizeLabel: "250 g" });
    expect(o.total).toBe(1350);
  });

  it("validates quantity, address and payment method", async () => {
    const line = { productId: 1, sizeIndex: 0, quantity: 1 };
    await expect(place.execute({ lines: [{ ...line, quantity: 21 }], customer, paymentMethodId: "esewa" })).rejects.toThrow(
      /Quantity/,
    );
    await expect(
      place.execute({ lines: [line], customer: { ...customer, address: " " }, paymentMethodId: "esewa" }),
    ).rejects.toMatchObject({ field: "address" });
    await expect(place.execute({ lines: [line], customer, paymentMethodId: "cash-at-clinic" })).rejects.toMatchObject({
      field: "payment",
    });
  });
});

describe("SubmitEnquiryUseCase", () => {
  const now = () => new Date(2026, 9, 6, 10);
  const valid = {
    firstName: " Sita ",
    lastName: "Gurung",
    email: "sita@example.com",
    phone: "9800000000",
    treatment: "Hydrotherapy",
    location: "Bakhundole, Lalitpur",
    preferredDate: { year: 2026, month: 9, day: 10 },
  };

  it("trims and records a valid enquiry", async () => {
    const uc = new SubmitEnquiryUseCase(new InMemoryEnquiryRepository(), now);
    const e = await uc.execute(valid);
    expect(e.reference).toMatch(/^CHY-E\d{5}$/);
    expect(e.firstName).toBe("Sita");
  });

  it("rejects bad email, missing treatment and past dates", async () => {
    const uc = new SubmitEnquiryUseCase(new InMemoryEnquiryRepository(), now);
    await expect(uc.execute({ ...valid, email: "nope" })).rejects.toMatchObject({ field: "email" });
    await expect(uc.execute({ ...valid, treatment: " " })).rejects.toMatchObject({ field: "treatment" });
    await expect(uc.execute({ ...valid, preferredDate: { year: 2026, month: 9, day: 1 } })).rejects.toMatchObject({
      field: "preferredDate",
    });
  });
});

describe("reviews", () => {
  it("returns featured testimonials, the reviews wall and the published stats", async () => {
    const repo = new StaticReviewRepository();
    expect(await new GetFeaturedReviewsUseCase(repo).execute()).toHaveLength(6);
    const reviews = new GetReviewsUseCase(repo);
    const wall = await reviews.execute();
    expect(wall).toHaveLength(12);
    expect(wall.every((r) => r.source && r.postedOn && !r.featured)).toBe(true);
    const stats = await reviews.stats();
    expect(stats).toMatchObject({ average: 4.8, count: 787 });
    expect(stats.distribution.reduce((s, d) => s + d.percent, 0)).toBe(100);
  });

  it("validates review submissions", async () => {
    const uc = new SubmitReviewUseCase(new InMemoryReviewSubmissionRepository());
    const ok = await uc.execute({ name: " Sita ", rating: 5, text: "Lovely" });
    expect(ok).toMatchObject({ name: "Sita", rating: 5 });
    expect(ok.reference).toMatch(/^CHY-R\d{5}$/);
    await expect(uc.execute({ name: "", rating: 5 })).rejects.toMatchObject({ field: "name" });
    await expect(uc.execute({ name: "A", rating: 0 })).rejects.toMatchObject({ field: "rating" });
    await expect(uc.execute({ name: "A", rating: 4.5 })).rejects.toMatchObject({ field: "rating" });
    await expect(uc.execute({ name: "A", rating: 3, email: "x@" })).rejects.toMatchObject({ field: "email" });
  });
});

describe("contact messages", () => {
  const valid = { name: "Sita Rai", phone: "+977 981-1111111", subject: "Membership", message: "Gold plan please" };

  it("saves a valid message with a reference", async () => {
    const msg = await new SendContactMessageUseCase(new InMemoryContactMessageRepository()).execute(valid);
    expect(msg).toMatchObject({ subject: "Membership", email: undefined });
    expect(msg.reference).toMatch(/^CHY-M\d{5}$/);
  });

  it("rejects bad phone, unknown subject and empty message", async () => {
    const uc = new SendContactMessageUseCase(new InMemoryContactMessageRepository());
    await expect(uc.execute({ ...valid, phone: "12" })).rejects.toMatchObject({ field: "phone" });
    await expect(uc.execute({ ...valid, subject: "Spam" })).rejects.toMatchObject({ field: "subject" });
    await expect(uc.execute({ ...valid, message: "   " })).rejects.toMatchObject({ field: "message" });
    await expect(uc.execute({ ...valid, email: "nope" })).rejects.toMatchObject({ field: "email" });
  });
});

describe("membership", () => {
  it("lists three tiers with one featured, and finds by id", async () => {
    const uc = new GetMembershipTiersUseCase(new StaticMembershipRepository());
    const tiers = await uc.execute();
    expect(tiers.map((t) => t.id)).toEqual(["silver", "gold", "platinum"]);
    expect(tiers.filter((t) => t.featured).map((t) => t.id)).toEqual(["gold"]);
    expect(await uc.find("gold")).toMatchObject({ annualPrice: 15000 });
    expect(await uc.find("bronze")).toBeNull();
  });
});
