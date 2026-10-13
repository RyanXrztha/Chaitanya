import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

// Loads the original prototype scripts from the design handoff so the port can be
// checked against them. Parity suites skip when the handoff folder is absent.

export const HANDOFF_DIR = join(__dirname, "..", "design_handoff_chaitanya_website");
export const hasHandoff = existsSync(HANDOFF_DIR);

function runScript<T>(file: string, pick: (window: Record<string, unknown>) => T): T {
  const window: Record<string, unknown> = {};
  runInNewContext(readFileSync(join(HANDOFF_DIR, file), "utf8"), { window });
  return pick(window);
}

export interface ProtoService {
  id: number;
  name: string;
  subLabel: string;
  catLabel: string;
  featuredRank: number;
  price: number;
  mins: number;
}

export function loadProtoServices() {
  return runScript("services-data.js", (w) => w.CHY_SERVICES as { services: ProtoService[] });
}

export interface ProtoSearchItem {
  kind: string;
  title: string;
  sub: string;
}

export function loadProtoSearch() {
  return runScript(
    "search-index.js",
    (w) => w.CHY_SEARCH as { search(q: string, limit?: number): ProtoSearchItem[]; popular: string[] },
  );
}

export interface ProtoTherapist {
  id: string;
  days: number[];
  times: string[];
}

/** The availability helpers defined at the top of Booking.dc.html's logic script. */
export function loadProtoAvailability() {
  const html = readFileSync(join(HANDOFF_DIR, "Booking.dc.html"), "utf8");
  const start = html.indexOf("const ALL_TIMES");
  const end = html.indexOf("const daysLabel");
  const src =
    html.slice(start, end) +
    "\nresult = { ALL_TIMES, THERAPISTS, NO_PREF, dayAvailable, slotAvailable };";
  const ctx: { result?: unknown } = {};
  runInNewContext(src, ctx);
  return ctx.result as {
    ALL_TIMES: string[];
    THERAPISTS: ProtoTherapist[];
    NO_PREF: ProtoTherapist;
    dayAvailable(th: ProtoTherapist, d: Date): boolean;
    slotAvailable(th: ProtoTherapist, d: Date, t: string): boolean;
  };
}
