/**
 * Motion. Reduced-motion is built FIRST, not patched last.
 *
 * `better-interface` escalates motion that ignores prefers-reduced-motion to a
 * HIGH finding on sight. So the guard here is at CONSTRUCTION — Lenis is never
 * instantiated under reduce, rather than started and then stopped.
 *
 * ONE smooth-scroll engine: Lenis. Never Locomotive as well. audit.py asserts it.
 */

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReduced(): boolean {
  return window.matchMedia(REDUCE_QUERY).matches;
}

/* -------------------------------------------------------------------------- */
/* Smooth scroll                                                              */
/* -------------------------------------------------------------------------- */

let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

export async function initSmoothScroll(): Promise<void> {
  // The guard is here, before construction. Not a later .stop().
  if (prefersReduced()) return;

  const { default: Lenis } = await import("lenis");

  const instance = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis = instance as unknown as typeof lenis;

  function raf(time: number) {
    instance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

export function destroySmoothScroll(): void {
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

export function initMotion(): void {
  initReveals();
  initNavEdge();
  void initSmoothScroll();
}
