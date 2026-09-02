/**
 * Day trips, diving, PADI and add-ons.
 * Source: `.md files/DATA.md` §6, §7, §8. Publication approved 2026-09-02.
 *
 * `price: null` means no verified amount. It renders the approved fallback,
 * never 0 and never "free". See src/components/Gated.astro.
 */

export interface DayTrip {
  code: string;
  slug: string;
  area: { bm: string; en: string };
  destinations: string[];
  /** Malaysian citizen price, per person. */
  local: number | null;
  /** Non-Malaysian price, per person. */
  intl: number | null;
}

/** Inclusions are identical across every day-trip route (DATA.md §6). */
export const DAYTRIP_INCLUSIONS = {
  bm: ["Bot", "Makan tengah hari", "Pemandu", "Bayaran jeti", "Set snorkeling", "Malim Gunung"],
  en: ["Boat", "Lunch", "Guide", "Jetty fee", "Snorkeling set", "Malim Gunung"],
};

/**
 * Life jacket is NOT included and must be rented. The rate is BLOCKED, so it is
 * published as an exclusion with no amount — never omitted, never priced.
 * Phase 5 rule: unknown is not the same as excluded.
 */
export const DAYTRIP_EXCLUSIONS = {
  bm: ["Sewa jaket keselamatan (dikenakan setiap hari)"],
  en: ["Life jacket rental (charged per day)"],
};

export const DAY_TRIPS: DayTrip[] = [
  {
    code: "SPTT-DT-TSAK",
    slug: "tun-sakaran",
    area: { bm: "Tun Sakaran", en: "Tun Sakaran" },
    destinations: ["Bohey Dulang", "Mantabuan", "Sibuan"],
    local: 172,
    intl: 290,
  },
  {
    code: "SPTT-DT-MABK",
    slug: "mabul-kapalai",
    area: { bm: "Kawasan Mabul", en: "Mabul area" },
    destinations: ["Mabul", "Kapalai"],
    local: 130,
    intl: 210,
  },
  {
    code: "SPTT-DT-MATK",
    slug: "mataking",
    area: { bm: "Mataking", en: "Mataking" },
    destinations: ["Timba-Timba", "Pom-Pom", "Mataking"],
    local: 130,
    intl: 210,
  },
  {
    code: "SPTT-DT-TIMB",
    slug: "timbun-mata",
    area: { bm: "Timbun Mata & sukan air", en: "Timbun Mata & water sports" },
    destinations: ["Timbun Mata"],
    local: 380,
    intl: 440,
  },
];

/** Market suffix is part of the immutable code: -LCL or -INT. */
export function dayTripCode(trip: DayTrip, market: "LCL" | "INT"): string {
  return `${trip.code}-${market}`;
}

/* -------------------------------------------------------------------------- */

export interface DiveProduct {
  code: string;
  slug: string;
  name: { bm: string; en: string };
  price: number | null;
  /** Inclusions we can actually evidence. Empty array = nothing verified yet. */
  inclusions: { bm: string[]; en: string[] };
  /**
   * Duration is a PLANNING ESTIMATE, not a commitment. DATA.md marks the
   * schedule BLOCKED and requires it be qualified. Rendered with that wording.
   */
  durationEstimate?: { bm: string; en: string };
  blockers: string[];
}

export const DIVE_PRODUCTS: DiveProduct[] = [
  {
    code: "SPTT-DV-SCUBA-STD",
    slug: "scuba",
    name: { bm: "Menyelam skuba", en: "Scuba diving" },
    price: 380,
    inclusions: { bm: [], en: [] },
    blockers: ["B10"],
  },
  {
    code: "SPTT-DV-SIPADAN",
    slug: "sipadan",
    name: { bm: "Sipadan", en: "Sipadan" },
    price: 1350,
    inclusions: { bm: [], en: [] },
    blockers: ["B10"],
  },
  {
    code: "SPTT-DV-PADI-OW",
    slug: "padi-open-water",
    name: { bm: "PADI Open Water Diver", en: "PADI Open Water Diver" },
    price: 1200,
    inclusions: {
      bm: ["Peralatan", "Sijil PADI", "Jurulatih", "Pendaftaran", "Bahan kursus", "Latihan air terkawal", "Selam dari bot", "Sijil digital"],
      en: ["Equipment", "PADI certification", "Instructor", "Registration", "Course materials", "Confined-water training", "Boat dives", "Digital certificate"],
    },
    durationEstimate: { bm: "3–4 hari (anggaran perancangan)", en: "3–4 days (planning estimate)" },
    blockers: ["B10"],
  },
  {
    code: "SPTT-DV-PADI-AOW",
    slug: "padi-advanced-open-water",
    name: { bm: "PADI Advanced Open Water Diver", en: "PADI Advanced Open Water Diver" },
    price: 1200,
    inclusions: {
      bm: ["Peralatan", "Sijil PADI", "Jurulatih", "Pendaftaran", "Bahan kursus", "Latihan air terkawal", "Selam dari bot", "Sijil digital"],
      en: ["Equipment", "PADI certification", "Instructor", "Registration", "Course materials", "Confined-water training", "Boat dives", "Digital certificate"],
    },
    durationEstimate: { bm: "2 hari (anggaran perancangan)", en: "2 days (planning estimate)" },
    blockers: ["B10"],
  },
];

/* -------------------------------------------------------------------------- */

export interface AddOn {
  code: string;
  name: { bm: string; en: string };
  price: number | null;
  basis: { bm: string; en: string };
}

/** Only confirmed add-ons are published. BLOCKED fees are not listed at all. */
export const ADD_ONS: AddOn[] = [
  {
    code: "SPTT-AO-TRANSPARENT-GRP",
    name: { bm: "Bot lutsinar", en: "Transparent boat" },
    price: 100,
    basis: { bm: "Setiap kumpulan", en: "Per group" },
  },
  {
    code: "SPTT-AO-SEAWALK-PAX",
    name: { bm: "Seawalking", en: "Seawalking" },
    price: 280,
    basis: { bm: "Setiap orang", en: "Per person" },
  },
  {
    code: "SPTT-AO-FINS-PAX",
    name: { bm: "Sewa fin", en: "Fins rental" },
    price: 10,
    basis: { bm: "Setiap orang", en: "Per person" },
  },
  {
    code: "SPTT-AO-LIFEJACKET-DAY",
    name: { bm: "Sewa jaket keselamatan", en: "Life jacket rental" },
    price: null, // BLOCKED — rate unresolved. Listed, not priced.
    basis: { bm: "Setiap hari", en: "Per day" },
  },
  {
    code: "SPTT-FE-TRANSPORT-LOWPAX",
    name: { bm: "Caj kenderaan 2–3 penumpang", en: "Low-passenger vehicle charge (2–3 pax)" },
    price: 50,
    basis: { bm: "Setiap pengangkutan", en: "Per transport" },
  },
];
