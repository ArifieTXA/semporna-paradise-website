/**
 * ONE route map generates both languages.
 *
 * This single file removes four v1 defects structurally, not by fixing symptoms:
 *
 *  #1  Every BM page declared the homepage as its canonical URL, because
 *      SEOHead defaulted `canonical` to the site root and only 15 of 34 pages
 *      passed one. Canonical is now DERIVED, never passed by hand.
 *  #2  hreflang alternates always targeted `/` and `/en`, never the current
 *      page's twin. Twins are now declared here, once.
 *  #4  Six dead links on the homepage alone. `href()` below only accepts a
 *      RouteId, so a typo is a TypeScript error, not a 404 in production.
 *  #11 Six BM pages had no English twin. Every entry carries both paths, and
 *      `assertParity()` fails the build if one is missing.
 */

export type Lang = "bm" | "en";

export interface RouteDef {
  /** BM path, at the site root. */
  bm: string;
  /** EN path, always under /en/. */
  en: string;
  title: { bm: string; en: string };
  /** Which surface dominates. Drives the depth ramp — see DESIGN.md §1. */
  depth: "surface" | "shallow" | "reef" | "deep" | "abyss";
  /** Shown in the main nav, in this order. */
  nav?: number;
  /** Overrides `title` for the nav bar label only. Footer keeps `title`. */
  navLabel?: { bm: string; en: string };
}

export const ROUTES = {
  home: {
    bm: "/", en: "/en/",
    title: { bm: "Laman Utama", en: "Home" },
    depth: "surface",
  },
  packages: {
    bm: "/pakej/", en: "/en/packages/",
    title: { bm: "Semua Pakej", en: "All Packages" },
    depth: "shallow", nav: 1,
    navLabel: { bm: "Pakej", en: "Packages" },
  },
  resortPackages: {
    bm: "/pakej/resort/", en: "/en/packages/resort/",
    title: { bm: "Pakej Resort", en: "Resort Packages" },
    depth: "shallow",
  },
  resorts: {
    bm: "/resort/", en: "/en/resorts/",
    title: { bm: "Senarai Resort", en: "Resorts" },
    depth: "reef", nav: 2,
    navLabel: { bm: "Resort", en: "Resorts" },
  },
  dayTrips: {
    bm: "/lawatan-harian/", en: "/en/day-trips/",
    title: { bm: "Lawatan Harian Pulau", en: "Island Day Trips" },
    depth: "reef", nav: 3,
    navLabel: { bm: "Lawatan harian", en: "Day trips" },
  },
  diving: {
    bm: "/selam-padi/", en: "/en/diving-padi/",
    title: { bm: "Selam & PADI", en: "Diving & PADI" },
    depth: "deep", nav: 4,
  },
  sipadan: {
    bm: "/selam-padi/sipadan/", en: "/en/diving-padi/sipadan/",
    title: { bm: "Sipadan", en: "Sipadan" },
    depth: "abyss",
  },
  planner: {
    bm: "/rancang-perjalanan/", en: "/en/plan-your-trip/",
    title: { bm: "Rancang Perjalanan", en: "Plan Your Trip" },
    depth: "surface", nav: 5,
    navLabel: { bm: "Rancang perjalanan", en: "Plan your trip" },
  },
  trust: {
    bm: "/kepercayaan-keselamatan/", en: "/en/trust-safety/",
    title: { bm: "Kepercayaan & Keselamatan", en: "Trust & Safety" },
    depth: "surface",
  },
  about: {
    bm: "/tentang/", en: "/en/about/",
    title: { bm: "Tentang Kami", en: "About Us" },
    depth: "surface", nav: 6,
    navLabel: { bm: "Tentang & kepercayaan", en: "About & trust" },
  },
  contact: {
    bm: "/hubungi/", en: "/en/contact/",
    title: { bm: "Hubungi", en: "Contact" },
    depth: "surface",
  },
  faq: {
    bm: "/soalan-lazim/", en: "/en/faq/",
    title: { bm: "Soalan Lazim", en: "FAQ" },
    depth: "surface",
  },
  privacy: {
    bm: "/privasi/", en: "/en/privacy/",
    title: { bm: "Dasar Privasi", en: "Privacy Policy" },
    depth: "surface",
  },
  terms: {
    bm: "/terma/", en: "/en/terms/",
    title: { bm: "Terma & Syarat", en: "Terms & Conditions" },
    depth: "surface",
  },
} as const satisfies Record<string, RouteDef>;

export type RouteId = keyof typeof ROUTES;

/** Type-safe href. A typo is a compile error, not a dead link. */
export function href(id: RouteId, lang: Lang): string {
  return ROUTES[id][lang];
}

/** The other language's URL for this route. Feeds hreflang. */
export function twin(id: RouteId, lang: Lang): string {
  return ROUTES[id][lang === "bm" ? "en" : "bm"];
}

export function title(id: RouteId, lang: Lang): string {
  return ROUTES[id].title[lang];
}

/** Nav-bar label. Falls back to `title` when no `navLabel` is set. */
export function navTitle(id: RouteId, lang: Lang): string {
  return (ROUTES[id] as RouteDef).navLabel?.[lang] ?? ROUTES[id].title[lang];
}

export function navRoutes(): RouteId[] {
  return (Object.keys(ROUTES) as RouteId[])
    .filter((id) => "nav" in ROUTES[id])
    .sort((a, b) => (ROUTES[a] as RouteDef).nav! - (ROUTES[b] as RouteDef).nav!);
}

/** Dynamic resort detail pages are not in ROUTES. They mirror by slug. */
export function resortDetailPath(slug: string, lang: Lang): string {
  return lang === "bm" ? `/resort/${slug}/` : `/en/resorts/${slug}/`;
}

/**
 * Build-time parity guard. Called from Layout.astro.
 * Fails the build if any route is missing a twin (defect #11).
 */
export function assertParity(): void {
  for (const [id, def] of Object.entries(ROUTES) as [RouteId, RouteDef][]) {
    if (!def.bm || !def.en) {
      throw new Error(`[routes] "${id}" is missing a language twin. BM="${def.bm}" EN="${def.en}"`);
    }
    if (!def.en.startsWith("/en/")) {
      throw new Error(`[routes] "${id}" EN path must live under /en/ — got "${def.en}"`);
    }
    if (def.bm.startsWith("/en/")) {
      throw new Error(`[routes] "${id}" BM path must not live under /en/ — got "${def.bm}"`);
    }
  }
}
