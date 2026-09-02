/**
 * WhatsApp deep links — the only conversion channel on this site (hard rule 10).
 *
 * v1 defect #3: the homepage rebuilt numbers with `.slice(-9)` and dropped a
 * digit, emitting `wa.me/60131277301` for a real number of `601131277301`.
 * Nothing in this file derives a number from a display string. E.164 values come
 * straight from config.ts and are used verbatim.
 *
 * Every product CTA carries its SPTT- code so sales receives a qualified
 * enquiry instead of "hi, price?" (REDESIGN-BRIEF §6.3, §6.4).
 */

import { PRIMARY_WA, type WhatsAppContact } from "../data/config";
import type { Lang } from "./gated";

export interface EnquiryContext {
  /** Immutable SPTT code, e.g. `SPTT-RS-ADIL-STD-3D2N`. */
  code?: string;
  /** Human-readable product name shown to sales. */
  product?: string;
  /** Optional extra qualifiers from the trip shaper. */
  detail?: string[];
}

const OPENING: Record<Lang, string> = {
  bm: "Salam Semporna Paradise, saya berminat dengan pakej ini.",
  en: "Hello Semporna Paradise, I am interested in this package.",
};

const LABELS: Record<Lang, { code: string; product: string }> = {
  bm: { code: "Kod", product: "Pakej" },
  en: { code: "Code", product: "Package" },
};

/** Compose the prefilled message body. */
export function enquiryMessage(ctx: EnquiryContext, lang: Lang): string {
  const lines: string[] = [OPENING[lang]];

  if (ctx.product) lines.push(`${LABELS[lang].product}: ${ctx.product}`);
  if (ctx.code) lines.push(`${LABELS[lang].code}: ${ctx.code}`);
  if (ctx.detail?.length) lines.push(...ctx.detail);

  return lines.join("\n");
}

/**
 * Full wa.me URL. The number is passed through untouched.
 */
export function waLink(
  ctx: EnquiryContext,
  lang: Lang,
  contact: WhatsAppContact = PRIMARY_WA,
): string {
  const text = encodeURIComponent(enquiryMessage(ctx, lang));
  return `https://wa.me/${contact.e164}?text=${text}`;
}

/**
 * Guard used by the build test: a display string and an E.164 string must
 * describe the same number. `016-3680049` -> `60163680049`.
 */
export function displayMatchesE164(display: string, e164: string): boolean {
  const local = display.replace(/\D/g, "");           // 0163680049
  if (!local.startsWith("0")) return false;
  return e164 === `60${local.slice(1)}`;
}
