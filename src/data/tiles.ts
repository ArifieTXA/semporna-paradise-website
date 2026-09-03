/**
 * Reel tiles — silent looping video owned by Semporna Paradise.
 *
 * Source: the company's own Instagram account, @sem4naparadise. The owner
 * directed on 2026-09-03 that the company's own footage be published
 * (CONTEXT.md §5, owner override). `Videos/iamirahsna_/` is a private
 * individual's account with no consent on file and is NEVER used.
 *
 * GENERATED FILE. Edit scripts/gen-tiles-ts.py, not this. Rebuild with:
 *   node scripts/build-tiles.mjs && python scripts/gen-tiles-ts.py
 *
 * Provenance for every file is in `img-raw/SOURCES.md`.
 *
 * Labels and alt strings are hand-written in the generator, not derived from
 * the Instagram caption — captions carry sales copy, dates and availability
 * claims, and CONTEXT.md hard rules 2 and 6 apply to a caption exactly as they
 * do to body copy. Nothing below promises availability, safety or an outcome.
 */
import type { Lang } from "../lib/gated";

export interface Tile {
  /** File stem under /video/tiles/. Stable, traceable to the source reel. */
  id: string;
  /** Subject bucket. Sections pick tiles by this, never by position. */
  subject: string;
  /**
   * Short visible label. `null` when the only honest description is "the sea
   * around Semporna" — repeating that down a whole strip says nothing, and a
   * more specific one would be invented. <VideoTile> renders no caption then.
   */
  label: Record<Lang, string> | null;
  /** What a screen reader hears. Describes the frame, not what it proves. */
  alt: Record<Lang, string>;
  w: number;
  h: number;
}

export const TILES: Tile[] = [
  {
    id: "reel-DYvfflFlOUm",
    subject: "dayang",
    label: { bm: "Dayang Resort", en: "Dayang Resort" },
    alt: { bm: "Rakaman di Dayang Resort — rumah atas air dan laluan papan di atas air cetek.", en: "Footage at Dayang Resort — overwater rooms and a boardwalk above shallow water." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYLXK2Mmhr0",
    subject: "snorkel",
    label: { bm: "Snorkeling", en: "Snorkelling" },
    alt: { bm: "Rakaman snorkeling di air cetek jernih berhampiran pulau.", en: "Footage of snorkelling in clear shallow water near an island." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYs1XOjlJZ0",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYf-Di4CKls",
    subject: "sibuan",
    label: { bm: "Pulau Sibuan", en: "Sibuan Island" },
    alt: { bm: "Rakaman di Pulau Sibuan — beting pasir putih dan pokok kelapa.", en: "Footage at Sibuan Island — a white sandbar and coconut palms." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYdtpTljegA",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYqQmLAgWrX",
    subject: "seawalk",
    label: { bm: "Seawalking", en: "Seawalking" },
    alt: { bm: "Rakaman aktiviti seawalking — tetamu memakai helmet berjalan di dasar cetek.", en: "Footage of seawalking — guests in helmets walking on the shallow bottom." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYx-76rCndJ",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYYUu8dlCB4",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DY-26OoDedL",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-Dae6cQeEY26",
    subject: "snorkel",
    label: { bm: "Snorkeling", en: "Snorkelling" },
    alt: { bm: "Rakaman snorkeling di air cetek jernih berhampiran pulau.", en: "Footage of snorkelling in clear shallow water near an island." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYijbaLCXo0",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 236,
  },
  {
    id: "reel-DamqD8ejlUM",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DY0jrp6DNA5",
    subject: "guests",
    label: { bm: "Tetamu", en: "Guests" },
    alt: { bm: "Rakaman tetamu di kawasan resort pada hujung perjalanan.", en: "Footage of guests around the resort at the end of a trip." },
    w: 420, h: 746,
  },
  {
    id: "reel-DbCPWvdT0hz",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-Dahfw-eDaK2",
    subject: "hopping",
    label: { bm: "Island hopping", en: "Island hopping" },
    alt: { bm: "Rakaman perjalanan bot antara pulau di Laut Sulawesi.", en: "Footage of a boat crossing between islands in the Celebes Sea." },
    w: 420, h: 746,
  },
  {
    id: "reel-DUhGISVks1s",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 746,
  },
  {
    id: "reel-DaUmm",
    subject: "snorkel",
    label: { bm: "Snorkeling", en: "Snorkelling" },
    alt: { bm: "Rakaman snorkeling di air cetek jernih berhampiran pulau.", en: "Footage of snorkelling in clear shallow water near an island." },
    w: 420, h: 746,
  },
  {
    id: "reel-DauV1jpx4C9",
    subject: "snorkel",
    label: { bm: "Snorkeling", en: "Snorkelling" },
    alt: { bm: "Rakaman snorkeling di air cetek jernih berhampiran pulau.", en: "Footage of snorkelling in clear shallow water near an island." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYI0us",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 236,
  },
  {
    id: "reel-DajnIoXCSts",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DUUROpCEvtm",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYnrsm5DMF8",
    subject: "royal",
    label: { bm: "Royal Resort", en: "Royal Resort" },
    alt: { bm: "Rakaman di Royal Resort — chalet atas air dan laut terbuka di sekelilingnya.", en: "Footage at Royal Resort — overwater chalets with open sea around them." },
    w: 420, h: 746,
  },
  {
    id: "reel-Da38CbYzyF4",
    subject: "adil",
    label: { bm: "Adil Waterhouse", en: "Adil Waterhouse" },
    alt: { bm: "Rakaman di Adil Waterhouse — rumah atas air di atas air pirus.", en: "Footage at Adil Waterhouse — an overwater house on turquoise water." },
    w: 420, h: 746,
  },
  {
    id: "reel-DY3Olyzisf7",
    subject: "bihing",
    label: { bm: "Bihing Angan", en: "Bihing Angan" },
    alt: { bm: "Rakaman di Bihing Angan — chalet kayu di atas air.", en: "Footage at Bihing Angan — timber chalets above the water." },
    w: 420, h: 746,
  },
  {
    id: "reel-DY8SKpQjZhK",
    subject: "sisipan",
    label: { bm: "Sisipan Resort", en: "Sisipan Resort" },
    alt: { bm: "Rakaman di Sisipan Resort — deretan chalet di atas tiang.", en: "Footage at Sisipan Resort — a row of chalets on stilts." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYN6RsbEpQp",
    subject: "paghalian",
    label: { bm: "Paghalian Resort", en: "Paghalian Resort" },
    alt: { bm: "Rakaman di Paghalian Resort — laluan papan dan air cetek.", en: "Footage at Paghalian Resort — a boardwalk and shallow water." },
    w: 420, h: 746,
  },
  {
    id: "reel-DUUiQDlkshW",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYnruNyDtRQ",
    subject: "maglami",
    label: { bm: "Maglami-Lami", en: "Maglami-Lami" },
    alt: { bm: "Rakaman di Maglami-Lami — chalet atas air pada waktu siang.", en: "Footage at Maglami-Lami — overwater chalets in daylight." },
    w: 420, h: 746,
  },
  {
    id: "reel-DY5tWTZjUya",
    subject: "nusakuya",
    label: { bm: "Nusakuya Resort", en: "Nusakuya Resort" },
    alt: { bm: "Rakaman di Nusakuya Resort — bangunan atas air dan laut di belakang.", en: "Footage at Nusakuya Resort — overwater buildings with the sea behind." },
    w: 420, h: 746,
  },
  {
    id: "reel-DaXT4CQj3A4",
    subject: "royal",
    label: { bm: "Royal Resort", en: "Royal Resort" },
    alt: { bm: "Rakaman di Royal Resort — chalet atas air dan laut terbuka di sekelilingnya.", en: "Footage at Royal Resort — overwater chalets with open sea around them." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYIyOZpiV3-",
    subject: "sea",
    label: null,
    alt: { bm: "Rakaman laut dan pulau di sekitar Semporna.", en: "Footage of the sea and islands around Semporna." },
    w: 420, h: 746,
  },
  {
    id: "reel-DYvaKb",
    subject: "singamata",
    label: { bm: "Singamata", en: "Singamata" },
    alt: { bm: "Rakaman di Singamata — platform atas air dan lagun di sekelilingnya.", en: "Footage at Singamata — an overwater platform and the lagoon around it." },
    w: 420, h: 746,
  },
  {
    id: "reel-DazmDKqgV2p",
    subject: "hopping",
    label: { bm: "Island hopping", en: "Island hopping" },
    alt: { bm: "Rakaman perjalanan bot antara pulau di Laut Sulawesi.", en: "Footage of a boat crossing between islands in the Celebes Sea." },
    w: 420, h: 752,
  },
  {
    id: "reel-DbFATUxjbje",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 752,
  },
  {
    id: "reel-DZUbEYiEzpF",
    subject: "snorkel",
    label: { bm: "Snorkeling", en: "Snorkelling" },
    alt: { bm: "Rakaman snorkeling di air cetek jernih berhampiran pulau.", en: "Footage of snorkelling in clear shallow water near an island." },
    w: 420, h: 754,
  },
  {
    id: "reel-DZR2TAEDpxu",
    subject: "snorkel",
    label: { bm: "Snorkeling", en: "Snorkelling" },
    alt: { bm: "Rakaman snorkeling di air cetek jernih berhampiran pulau.", en: "Footage of snorkelling in clear shallow water near an island." },
    w: 420, h: 684,
  },
  {
    id: "reel-DXilygWjDeA",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 526,
  },
  {
    id: "reel-DXilyfuDCDo",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 526,
  },
  {
    id: "reel-DXilyhjjB-P",
    subject: "honeymoon",
    label: { bm: "Pasangan", en: "Couples" },
    alt: { bm: "Rakaman pasangan tetamu di kawasan resort atas air.", en: "Footage of guests as a couple around the overwater resort area." },
    w: 420, h: 526,
  },
];

/** Portrait tiles only — the two landscape cuts break a 9:16 tile grid. */
export const PORTRAIT_TILES = TILES.filter((t) => t.h > t.w);

/** A stable slice, so the same tiles render on every build. */
export function tiles(n: number, offset = 0): Tile[] {
  return PORTRAIT_TILES.slice(offset, offset + n);
}
