"""
gen-tiles-ts.py — writes src/data/tiles.ts from scripts/tiles-build.json.

Labels and alt strings are HAND-WRITTEN in the SUB table below, never derived
from the Instagram caption. Captions carry sales copy, dates and availability
claims, and CONTEXT.md hard rules 2 and 6 apply to a caption exactly as they do
to body copy.

A tile whose only honest description is "the sea around Semporna" gets
`label: null`. Repeating one generic phrase down a whole strip tells the reader
nothing, and inventing a more specific one would be inventing a fact.

Usage: python scripts/gen-tiles-ts.py   (after node scripts/build-tiles.mjs)
"""

import json

BUILT = "scripts/tiles-build.json"
OUT = "src/data/tiles.ts"

# subject -> (label bm, label en, alt bm, alt en). label None = no caption.
SUB = {
 "dayang":   ("Dayang Resort", "Dayang Resort",
   "Rakaman di Dayang Resort — rumah atas air dan laluan papan di atas air cetek.",
   "Footage at Dayang Resort — overwater rooms and a boardwalk above shallow water."),
 "royal":    ("Royal Resort", "Royal Resort",
   "Rakaman di Royal Resort — chalet atas air dan laut terbuka di sekelilingnya.",
   "Footage at Royal Resort — overwater chalets with open sea around them."),
 "adil":     ("Adil Waterhouse", "Adil Waterhouse",
   "Rakaman di Adil Waterhouse — rumah atas air di atas air pirus.",
   "Footage at Adil Waterhouse — an overwater house on turquoise water."),
 "sisipan":  ("Sisipan Resort", "Sisipan Resort",
   "Rakaman di Sisipan Resort — deretan chalet di atas tiang.",
   "Footage at Sisipan Resort — a row of chalets on stilts."),
 "paghalian":("Paghalian Resort", "Paghalian Resort",
   "Rakaman di Paghalian Resort — laluan papan dan air cetek.",
   "Footage at Paghalian Resort — a boardwalk and shallow water."),
 "maglami":  ("Maglami-Lami", "Maglami-Lami",
   "Rakaman di Maglami-Lami — chalet atas air pada waktu siang.",
   "Footage at Maglami-Lami — overwater chalets in daylight."),
 "nusakuya": ("Nusakuya Resort", "Nusakuya Resort",
   "Rakaman di Nusakuya Resort — bangunan atas air dan laut di belakang.",
   "Footage at Nusakuya Resort — overwater buildings with the sea behind."),
 "bihing":   ("Bihing Angan", "Bihing Angan",
   "Rakaman di Bihing Angan — chalet kayu di atas air.",
   "Footage at Bihing Angan — timber chalets above the water."),
 "singamata":("Singamata", "Singamata",
   "Rakaman di Singamata — platform atas air dan lagun di sekelilingnya.",
   "Footage at Singamata — an overwater platform and the lagoon around it."),
 "sibuan":   ("Pulau Sibuan", "Sibuan Island",
   "Rakaman di Pulau Sibuan — beting pasir putih dan pokok kelapa.",
   "Footage at Sibuan Island — a white sandbar and coconut palms."),
 "seawalk":  ("Seawalking", "Seawalking",
   "Rakaman aktiviti seawalking — tetamu memakai helmet berjalan di dasar cetek.",
   "Footage of seawalking — guests in helmets walking on the shallow bottom."),
 "snorkel":  ("Snorkeling", "Snorkelling",
   "Rakaman snorkeling di air cetek jernih berhampiran pulau.",
   "Footage of snorkelling in clear shallow water near an island."),
 "hopping":  ("Island hopping", "Island hopping",
   "Rakaman perjalanan bot antara pulau di Laut Sulawesi.",
   "Footage of a boat crossing between islands in the Celebes Sea."),
 "honeymoon":("Pasangan", "Couples",
   "Rakaman pasangan tetamu di kawasan resort atas air.",
   "Footage of guests as a couple around the overwater resort area."),
 "guests":   ("Tetamu", "Guests",
   "Rakaman tetamu di kawasan resort pada hujung perjalanan.",
   "Footage of guests around the resort at the end of a trip."),
 "sea":      (None, None,
   "Rakaman laut dan pulau di sekitar Semporna.",
   "Footage of the sea and islands around Semporna."),
}

SKIP = {"booth"}   # a trade-fair stand is not travel imagery

HEAD = '''/**
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

export const TILES: Tile[] = ['''

TAIL = '''];

/** Portrait tiles only — the two landscape cuts break a 9:16 tile grid. */
export const PORTRAIT_TILES = TILES.filter((t) => t.h > t.w);

/** A stable slice, so the same tiles render on every build. */
export function tiles(n: number, offset = 0): Tile[] {
  return PORTRAIT_TILES.slice(offset, offset + n);
}
'''


def esc(s):
    return s.replace(chr(92), chr(92) * 2).replace('"', chr(92) + '"')


def main():
    built = json.load(open(BUILT, encoding="utf-8"))["built"]
    rows = [t for t in built if t["subject"] not in SKIP]

    out = [HEAD]
    for t in rows:
        lb, le, ab, ae = SUB[t["subject"]]
        label = "null" if lb is None else '{ bm: "%s", en: "%s" }' % (esc(lb), esc(le))
        out.append("  {")
        out.append('    id: "%s",' % t["id"])
        out.append('    subject: "%s",' % t["subject"])
        out.append("    label: %s," % label)
        out.append('    alt: { bm: "%s", en: "%s" },' % (esc(ab), esc(ae)))
        out.append("    w: %d, h: %d," % (t["w"], t["h"]))
        out.append("  },")
    out.append(TAIL)

    open(OUT, "w", encoding="utf-8").write("\n".join(out))
    labelled = sum(1 for t in rows if SUB[t["subject"]][0] is not None)
    print(f"wrote {OUT} — {len(rows)} tiles ({labelled} labelled, "
          f"{len(rows) - labelled} unlabelled), "
          f"{sum(1 for t in rows if t['h'] > t['w'])} portrait")


if __name__ == "__main__":
    main()
