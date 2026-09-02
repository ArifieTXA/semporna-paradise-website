/**
 * The fallback vocabulary for missing values.
 *
 * v1 leaked raw blocker tokens onto 11 of 34 public pages — `{Harga Perlu
 * Disahkan - B02}`, `[Media Sedang Disahkan - MP-005]`, `{Kemudahan bilik -
 * B04}`, `[Nama Resort]`. That is defect #7 and it read as an unfinished site
 * to a paying customer.
 *
 * The fix is structural: a blocker code is a BUILD-TIME attribute. It is never
 * a string in the output. There is no code path here that returns one.
 */

export type Lang = "bm" | "en";
export type FallbackKind = "price" | "availability" | "facility" | "generic";

/** Approved public wording. Hard rules 1 and 2. */
const FALLBACKS: Record<FallbackKind, Record<Lang, string>> = {
  price: {
    bm: "Pengesahan harga diperlukan",
    en: "Price confirmation required",
  },
  availability: {
    bm: "Atas Permintaan",
    en: "On Request",
  },
  facility: {
    bm: "Maklumat akan dikemas kini",
    en: "Information to be updated",
  },
  generic: {
    bm: "Maklumat akan dikemas kini",
    en: "Information to be updated",
  },
};

export function fallbackText(kind: FallbackKind, lang: Lang): string {
  return FALLBACKS[kind][lang];
}

/**
 * Currency. `RM1,200` — no space, thousands separator, no decimals.
 * DATA.md §4 / CONTEXT.md §4.
 */
export function formatRM(amount: number): string {
  return `RM${amount.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;
}

/**
 * Resolve a value to its public string.
 * Returns `{ text, isFallback }` so the caller can style a fallback differently
 * without ever needing to know the blocker code.
 */
export function resolveGated(
  value: number | string | null | undefined,
  kind: FallbackKind,
  lang: Lang,
): { text: string; isFallback: boolean } {
  if (value === null || value === undefined || value === "") {
    return { text: fallbackText(kind, lang), isFallback: true };
  }
  if (typeof value === "number") {
    return { text: formatRM(value), isFallback: false };
  }
  return { text: value, isFallback: false };
}

/**
 * Build-time warning. Runs on the server during `astro build`, never in the
 * browser. Names the route and the blocker so gaps stay visible to us while
 * staying invisible to the customer.
 */
export function warnGated(route: string, blocker: string | undefined, kind: FallbackKind): void {
  if (import.meta.env.PROD) {
    console.warn(
      `[gated] ${route} fell back to "${kind}"${blocker ? ` — blocker ${blocker}` : ""}`,
    );
  }
}
