/**
 * Motion. Reduced-motion is built FIRST, not patched last.
 *
 * `better-interface` escalates motion that ignores prefers-reduced-motion to a
 * HIGH finding on sight. So the guard here is at CONSTRUCTION — Lenis is never
 * instantiated under reduce, rather than started and then stopped.
 *
 * ONE smooth-scroll engine: Lenis. Never Locomotive as well. audit.py asserts it.
 */

import type Lenis from "lenis";
import { initWordReveals } from "./reveal";
import { initScrollTheme } from "./scroll-theme";
import { initScrollFx } from "./scroll-fx";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReduced(): boolean {
  return window.matchMedia(REDUCE_QUERY).matches;
}

/* -------------------------------------------------------------------------- */
/* Smooth scroll                                                              */
/* -------------------------------------------------------------------------- */

let lenis: Lenis | null = null;
let rafId = 0;

/**
 * Tuned to the reference, measured off belarosa-chalet.ch on 2026-09-04:
 *
 *   new Lenis({ lerp: 0.1, wheelMultiplier: 0.5,
 *               gestureOrientation: "vertical",
 *               normalizeWheel: false, smoothTouch: false })
 *
 * `wheelMultiplier: 0.5` is the single biggest reason that page feels heavy —
 * one wheel click moves it half as far as a normal page, so every scroll-linked
 * transform gets twice as long on screen. It is also the reason our own numbers
 * for parallax and grow are worth copying literally: they were read at this
 * scroll rate.
 *
 * `lerp` and `duration` are mutually exclusive in Lenis. Passing `lerp` makes it
 * a per-frame interpolation towards the target rather than a fixed-length tween,
 * which is what the reference does and what ScrollTrigger's scrub expects.
 */
export async function initSmoothScroll(): Promise<Lenis | null> {
  // The guard is here, before construction. Not a later .stop().
  if (prefersReduced()) return null;

  const { default: Lenis } = await import("lenis");

  const instance = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.5,
    touchMultiplier: 1.6,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothWheel: true,
  });

  lenis = instance;

  // Its own loop, for now. scroll-fx.ts cancels this and hands the clock to
  // GSAP's ticker once ScrollTrigger is up, so the two never tick separately.
  // If that chunk never arrives, this loop is what keeps smooth scroll working.
  function raf(time: number) {
    instance.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return instance;
}

/** Called by scroll-fx.ts when GSAP's ticker takes over the frame loop. */
export function releaseSmoothScrollRaf(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

export function destroySmoothScroll(): void {
  releaseSmoothScrollRaf();
  lenis?.destroy();
  lenis = null;
}

/* -------------------------------------------------------------------------- */
/* Depth drift — sections fade in and rise 24px, once                          */
/* -------------------------------------------------------------------------- */

export function initReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!targets.length) return;

  // Under reduce, render final states immediately and never observe.
  if (prefersReduced()) {
    targets.forEach((el) => el.setAttribute("data-revealed", ""));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        io.unobserve(entry.target); // once, never re-plays
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );

  targets.forEach((el) => io.observe(el));
}

/* -------------------------------------------------------------------------- */
/* Nav edge — a hairline appears past 40px. A border, not a shadow.            */
/* Past 120px the sub-category links row collapses; the compact bar stays and  */
/* the "Menu" button becomes visible at every width. CSS carries the slide;    */
/* under reduced motion the CSS transition is removed, so the change is        */
/* instant. It is never carried by motion alone: the `.hdr[data-collapsed]     */
/* .subnav` rule in SiteHeader.astro also sets `visibility: hidden`, which     */
/* removes the six links from the tab order and the accessibility tree.        */
/* -------------------------------------------------------------------------- */

export function initNavEdge(): void {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav) return;

  // Mirror the state onto <html> too: the header is a sibling of <main>, not an
  // ancestor, so `--hdr-h` (theme.css) can only track the shrink from the root.
  const root = document.documentElement;

  const apply = () => {
    const y = window.scrollY;
    const scrolled = y > 40;
    const collapsed = y > 120;
    nav.toggleAttribute("data-scrolled", scrolled);
    nav.toggleAttribute("data-collapsed", collapsed);
    root.toggleAttribute("data-nav-scrolled", scrolled);
    root.toggleAttribute("data-nav-collapsed", collapsed);
  };
  apply();
  window.addEventListener("scroll", apply, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* Reel tiles — silent loops that only run while they are on screen            */
/*                                                                            */
/* A page can carry two dozen of these. Autoplaying all of them at once would  */
/* decode two dozen video streams for the sake of four the visitor can see, so */
/* each one starts when it enters the viewport and pauses when it leaves.      */
/*                                                                            */
/* Under reduce, and on a Save-Data or 2g connection, no <source> is ever      */
/* attached: the tile stays its poster image, which is a still frame of the    */
/* same clip. Nothing is hidden and no layout changes — WCAG 2.2.2 is met by   */
/* never starting the loop rather than by offering a pause button.             */
/* -------------------------------------------------------------------------- */

function thrifty(): boolean {
  const c = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? "");
}

export function initVideoTiles(): void {
  const tiles = document.querySelectorAll<HTMLVideoElement>("video[data-tile]");
  if (!tiles.length) return;

  if (prefersReduced() || thrifty()) return; // posters only. Never downloaded.

  const attach = (v: HTMLVideoElement) => {
    if (v.dataset.loaded) return;
    for (const [type, key] of [["video/webm", "webm"], ["video/mp4", "mp4"]] as const) {
      const src = v.dataset[key];
      if (!src) continue;
      const s = document.createElement("source");
      s.type = type;
      s.src = src;
      v.append(s);
    }
    v.dataset.loaded = "1";
    v.load();
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const v = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          attach(v);
          void v.play().catch(() => {/* autoplay refused: the poster stands in */});
        } else if (!v.paused) {
          v.pause();
        }
      }
    },
    { rootMargin: "200px 0px", threshold: 0.15 },
  );

  tiles.forEach((v) => io.observe(v));
}

/* -------------------------------------------------------------------------- */

export function initMotion(): void {
  // Order matters: the theme is settled before anything animates, so a heading
  // never reveals in the colour of the section it is leaving.
  initScrollTheme();
  initWordReveals();
  initReveals();
  initNavEdge();
  initVideoTiles();

  // Smooth scroll first, THEN the scroll-linked transforms — ScrollTrigger has
  // to be handed the Lenis instance to read scroll position from, or the two
  // run on separate clocks and the parallax lags the page under a fast fling.
  // Both are dynamic imports and neither blocks anything above.
  void initSmoothScroll().then((instance) =>
    initScrollFx(instance, releaseSmoothScrollRaf),
  );
}
