/**
 * Company identity and contact channels.
 * Source: `.md files/DATA.md` §1, §2.
 *
 * HARD RULE 8 — no invented data. v1 shipped `info@sempornaparadise.com`, which
 * was never confirmed by any source. There is NO email field in this file, on
 * purpose. Do not add one until Phase 1 records a confirmed address.
 *
 * HARD RULE 5 — the Maybank account number never appears on a public page. It is
 * deliberately absent from this file too.
 *
 * HARD RULE 4 — the licence is a LABEL, not a validity claim. Never render
 * "berlesen penuh", "sah sehingga", or any verification wording next to it.
 */

export const SITE_URL = "https://sempornaparadise.com";

export const COMPANY = {
  legalName: "Semporna Paradise Travel & Tours Sdn Bhd",
  shortName: "Semporna Paradise",
  /** Registered brand line. NOT a page heading — see REDESIGN-BRIEF §6.6. */
  tagline: "We Bring You To Paradise",
  /** Label only. No category, status or validity is confirmed. */
  licenceLabel: "KPK/LN:9569",
  address: "Jeti Pelancongan, Jalan Bangau-Bangau, 91308 Semporna, Sabah, Malaysia",
} as const;

export interface WhatsAppContact {
  code: string;
  /** Display form, as written in copy. */
  display: string;
  /** E.164, digits only. Built here once — NEVER derived with .slice(). */
  e164: string;
}

/**
 * All four numbers must display on the site (DATA.md §2).
 * v1 shipped only two, and mangled one with `.slice(-9)` — defect #3.
 *
 * The number `011-32177301` appears in old artwork. It is a typo and is never
 * published. `SPTT-WA-02` below is the corrected value.
 *
 * No routing owner is confirmed for any number, so the site never claims who
 * answers what.
 */
export const WHATSAPP: WhatsAppContact[] = [
  { code: "SPTT-WA-01", display: "016-3680049",  e164: "60163680049" },
  { code: "SPTT-WA-02", display: "011-31277301", e164: "601131277301" },
  { code: "SPTT-WA-03", display: "014-3460130",  e164: "60143460130" },
  { code: "SPTT-WA-04", display: "014-9360133",  e164: "60149360133" },
];

/** The number every product CTA routes to unless a page overrides it. */
export const PRIMARY_WA = WHATSAPP[0];

export const SOCIAL = {
  facebook: "https://www.facebook.com/sempornaparadise/",
  instagram: "https://www.instagram.com/sem4naparadise/",
  tiktok: "https://www.tiktok.com/@sempornaparadisetravel",
} as const;

export const HOURS = {
  bm: "8:00 pagi – 5:00 petang",
  en: "8:00 am – 5:00 pm",
} as const;
