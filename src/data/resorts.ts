/**
 * Resort package price table.
 *
 * SOURCE OF AUTHORITY: `HARGA RESORT-RESORT - LATEST.pdf`, transcribed into
 * `.md files/DATA.md` §5. Verified at VS-2 in Phase 1.
 * PUBLICATION: approved by the CEO 2026-09-02 (DATA.md -> KEY DECISIONS).
 *
 * Hard rules this file exists to enforce:
 *  - Rule 1  no hardcoded prices in templates. Templates read from here.
 *  - Rule 2  no availability claims. Every product defaults to "Atas Permintaan".
 *  - Rule 11 SPTT- codes are immutable. Never reassign one.
 *  - Rule 12 superseded tables are never republished. They are not in this file.
 *
 * A `null` price is NOT zero and NOT "excluded". It renders through <Gated> as
 * the approved fallback. See src/components/Gated.astro.
 */

export type Duration = "2D1N" | "3D2N" | "4D3N";

export interface Resort {
  /** Immutable SPTT code stem. Duration is appended at render time. */
  code: string;
  slug: string;
  name: string;
  room: string;
  /** null = no verified amount for this duration. Never render as 0. */
  prices: Record<Duration, number | null>;
  inclusions: string[];
  /** Blocker codes that still gate parts of this record. */
  blockers?: string[];
  notes?: string;
}

/** Copy shown in every duration column header. `2H1M` in copy, `2D1N` in codes. */
export const DURATION_LABELS: Record<Duration, { bm: string; en: string }> = {
  "2D1N": { bm: "2H1M", en: "2D1N" },
  "3D2N": { bm: "3H2M", en: "3D2N" },
  "4D3N": { bm: "4H3M", en: "4D3N" },
};

export const DURATIONS: Duration[] = ["2D1N", "3D2N", "4D3N"];

/** Inclusion phrases, kept as ids so both languages resolve from one list. */
const INC = {
  accom: "accom",
  meals: "meals",
  transport: "transport",
  permit: "permit",
  zipline: "zipline",
} as const;

export const INCLUSION_LABELS: Record<string, { bm: string; en: string }> = {
  accom: { bm: "Penginapan", en: "Accommodation" },
  meals: { bm: "Makan (sarapan, tengah hari, malam)", en: "Meals (breakfast, lunch, dinner)" },
  transport: { bm: "Pengangkutan lapangan terbang & bot", en: "Airport and boat transport" },
  permit: { bm: "Permit jeti & bot", en: "Jetty and boat permit" },
  zipline: { bm: "Zipline", en: "Zipline" },
};

const BASE = [INC.accom, INC.meals, INC.permit, INC.transport];

export const RESORTS: Resort[] = [
  {
    code: "SPTT-RS-ADIL-STD",
    slug: "adil-waterhouse",
    name: "Adil Waterhouse",
    room: "Standard",
    prices: { "2D1N": 620, "3D2N": 970, "4D3N": 1170 },
    inclusions: [INC.accom, INC.meals, INC.transport, INC.zipline],
    blockers: ["B04"],
    // Historical artwork advertised a free transparent boat, guide and snorkelling
    // area. Not re-confirmed. DATA.md marks it BLOCKED, so it is not published.
    notes: "adil-caution",
  },
  { code: "SPTT-RS-ROYAL-STD",        slug: "royal",          name: "Royal Resort",        room: "Standard", prices: { "2D1N": 1849, "3D2N": 2649, "4D3N": 3449 }, inclusions: [INC.accom, INC.meals, INC.transport] },
  { code: "SPTT-RS-DANGLAI-STD",      slug: "danglai",        name: "Danglai Resort",      room: "Standard", prices: { "2D1N": 1699, "3D2N": 2398, "4D3N": 3097 }, inclusions: BASE },
  { code: "SPTT-RS-DAYANG-STD",       slug: "dayang",         name: "Dayang Resort",       room: "Standard", prices: { "2D1N": 1650, "3D2N": 2230, "4D3N": 2840 }, inclusions: BASE },
  { code: "SPTT-RS-SISIPAN-STD",      slug: "sisipan",        name: "Sisipan Resort",      room: "Standard", prices: { "2D1N": 1550, "3D2N": 2050, "4D3N": 2550 }, inclusions: BASE },
  { code: "SPTT-RS-CRYSTAL-STD",      slug: "crystal",        name: "Crystal Resort",      room: "Standard", prices: { "2D1N": 1630, "3D2N": 2150, "4D3N": 2650 }, inclusions: BASE },
  { code: "SPTT-RS-SEASTAR-STD",      slug: "seastar",        name: "Seastar Resort",      room: "Standard", prices: { "2D1N": 1550, "3D2N": 2150, "4D3N": 2750 }, inclusions: BASE },
  { code: "SPTT-RS-NOURA-STD",        slug: "noura",          name: "Noura Resort",        room: "Standard", prices: { "2D1N": 1399, "3D2N": 1898, "4D3N": 2350 }, inclusions: BASE },
  { code: "SPTT-RS-SINGAMATA-BR",     slug: "singamata-basic",name: "Singamata",           room: "Basic",    prices: { "2D1N": 1250, "3D2N": 1650, "4D3N": 2150 }, inclusions: BASE },
  { code: "SPTT-RS-SINGAMATA-DR",     slug: "singamata-deluxe",name: "Singamata",          room: "Deluxe",   prices: { "2D1N": 1400, "3D2N": 1900, "4D3N": 2400 }, inclusions: BASE },
  { code: "SPTT-RS-MAGLAMI-STD",      slug: "maglami-lami",   name: "Maglami-Lami",        room: "Standard", prices: { "2D1N": 1450, "3D2N": 1830, "4D3N": 2170 }, inclusions: BASE },
  { code: "SPTT-RS-LATOLATO-STD",     slug: "lato-lato",      name: "Lato-Lato Resort",    room: "Standard", prices: { "2D1N": 1280, "3D2N": 1680, "4D3N": 2050 }, inclusions: BASE },
  { code: "SPTT-RS-PAGHALIAN-STD",    slug: "paghalian",      name: "Paghalian Resort",    room: "Standard", prices: { "2D1N": 1350, "3D2N": 1730, "4D3N": 2110 }, inclusions: BASE },
  { code: "SPTT-RS-BIHINGANGAN-STD",  slug: "bihing-angan",   name: "Bihing Angan",        room: "Standard", prices: { "2D1N": 1200, "3D2N": 1400, "4D3N": 1650 }, inclusions: BASE },
  { code: "SPTT-RS-NUSAKUYA-STD",     slug: "nusakuya",       name: "Nusakuya Resort",     room: "Standard", prices: { "2D1N": 875,  "3D2N": 1275, "4D3N": 1675 }, inclusions: BASE },
  { code: "SPTT-RS-EGANG-FAN",        slug: "egang-egang-fan",name: "Egang-Egang",         room: "Kipas",    prices: { "2D1N": 699,  "3D2N": 1299, "4D3N": 1499 }, inclusions: BASE },
  { code: "SPTT-RS-EGANG-AC",         slug: "egang-egang-ac", name: "Egang-Egang",         room: "Penyaman udara", prices: { "2D1N": 729, "3D2N": 1499, "4D3N": 1799 }, inclusions: BASE },
  // Aminah and Borneo Divers have no verified 2D1N amount. null, never 0.
  { code: "SPTT-RS-AMINAH-STD",       slug: "aminah",         name: "Aminah Resort",       room: "Standard", prices: { "2D1N": null, "3D2N": 1660, "4D3N": 1960 }, inclusions: BASE, blockers: ["B02"] },
  { code: "SPTT-RS-BORNEODIVERS-STD", slug: "borneo-divers-mabul", name: "Borneo Divers Mabul", room: "Standard", prices: { "2D1N": null, "3D2N": 2150, "4D3N": 2750 }, inclusions: BASE, blockers: ["B02"] },
  { code: "SPTT-RS-TOWN-STD",         slug: "pakej-bandar",   name: "Pakej Bandar",        room: "Town",     prices: { "2D1N": 500,  "3D2N": 750,  "4D3N": 900 },  inclusions: BASE, notes: "town-availability" },
];

/** Adult 7+, child 1-6 gets RM100 off. Confirmed, all resorts, all durations. */
export const CHILD_DISCOUNT_RM = 100;

/** Deposit per person. Confirmed. */
export const DEPOSIT_RM = 200;

export function resortBySlug(slug: string): Resort | undefined {
  return RESORTS.find((r) => r.slug === slug);
}

/** Full immutable code for one resort at one duration. */
export function productCode(resort: Resort, duration: Duration): string {
  return `${resort.code}-${duration}`;
}

/** Cheapest verified price across all durations. null if none verified. */
export function fromPrice(resort: Resort): number | null {
  const found = DURATIONS.map((d) => resort.prices[d]).filter(
    (p): p is number => typeof p === "number",
  );
  return found.length ? Math.min(...found) : null;
}
