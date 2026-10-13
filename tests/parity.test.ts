import { describe, expect, it } from "vitest";
import { TIME_SLOTS, fromJsDate, type TimeSlot } from "@/domain";
import { container } from "@/infrastructure/container";
import { InMemoryServiceRepository } from "@/infrastructure/repositories/InMemoryServiceRepository";
import { InMemoryTherapistRepository } from "@/infrastructure/repositories/InMemoryTherapistRepository";
import { MockAvailabilityRepository } from "@/infrastructure/repositories/MockAvailabilityRepository";
import { POPULAR_SEARCHES } from "@/application";
import { hasHandoff, loadProtoAvailability, loadProtoSearch, loadProtoServices } from "./handoff";

describe.skipIf(!hasHandoff)("parity with the design handoff prototypes", () => {
  it("derives the same service labels and featured ranks as services-data.js", async () => {
    const proto = loadProtoServices().services;
    const ours = await new InMemoryServiceRepository().listServices();
    expect(ours).toHaveLength(proto.length);
    for (const p of proto) {
      const s = ours.find((o) => o.id === p.id)!;
      expect(s, `service ${p.id}`).toBeDefined();
      expect(s.name).toBe(p.name);
      expect(s.subLabel).toBe(p.subLabel);
      expect(s.categoryLabel).toBe(p.catLabel);
      expect(s.featuredRank ?? -1).toBe(p.featuredRank);
      expect(s.durations[0]).toMatchObject({ price: p.price, minutes: p.mins });
    }
  });

  it("returns the same search results, in the same order, as search-index.js", async () => {
    const proto = loadProtoSearch();
    expect(POPULAR_SEARCHES).toEqual(proto.popular);
    const queries = [
      ...proto.popular,
      "relax",
      "deep tissue",
      "wax",
      "ayurvedic therapy",
      "powder",
      "npr 250",
      "faq",
      "contact",
      "book",
      "sp",
      "Ä",
      "zzz-no-match",
    ];
    for (const q of queries) {
      const expected = proto.search(q).map((i) => `${i.kind}|${i.title}|${i.sub}`);
      const actual = (await container.searchSite.execute(q)).map((e) => `${e.kind}|${e.title}|${e.subtitle}`);
      expect(actual, `query "${q}"`).toEqual(expected);
    }
  });

  it("computes identical therapist availability to Booking.dc.html for 120 days", async () => {
    const proto = loadProtoAvailability();
    expect([...TIME_SLOTS]).toEqual(proto.ALL_TIMES);
    const repo = new InMemoryTherapistRepository();
    const ours = [...(await repo.list()), await repo.anyTherapist()];
    const protoList = [...proto.THERAPISTS, proto.NO_PREF];
    const availability = new MockAvailabilityRepository();

    let checked = 0;
    for (let i = 0; i < 120; i++) {
      const js = new Date(2026, 9, 1 + i);
      const date = fromJsDate(js);
      for (const pt of protoList) {
        const t = ours.find((o) => o.id === pt.id)!;
        expect(availability.isDayAvailable(t, date), `${t.id} ${js.toDateString()}`).toBe(proto.dayAvailable(pt, js));
        for (const time of proto.ALL_TIMES) {
          expect(availability.isSlotAvailable(t, date, time as TimeSlot)).toBe(proto.slotAvailable(pt, js, time));
          checked++;
        }
      }
    }
    expect(checked).toBe(120 * 5 * 6);
  });
});
