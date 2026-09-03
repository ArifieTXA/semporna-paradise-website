/**
 * Scroll themes — motion inventory #2, and the reference's signature move.
 *
 * Each section declares `data-theme-section="1|2|3"`. When one crosses the
 * middle of the viewport, that value is written to `<html data-theme>`, and
 * every custom property in src/styles/themes.css swaps at once: page
 * background, body text, muted text, hairlines and the fixed header. The
 * header appearing to change colour as you scroll past a dark band is this,
 * not a separate effect.
 *
 * BelArosa runs ScrollTrigger with `start: "clamp(top 50%)"` and
 * `end: "clamp(bottom 50%)"`. An IntersectionObserver whose root box is
 * shrunk to a zero-height line at 50% of the viewport is the same trip line:
 * a section "intersects" exactly while that line is inside it.
 *
 * ── Reduced motion ───────────────────────────────────────────────────────
 * The theme still CHANGES under reduce. It carries meaning — it tells you
 * where you are in the page — and hiding it would remove information, not
 * motion. What reduce removes is the 700ms crossfade, and themes.css does
 * that. This file is identical either way, on purpose.
 *
 * ── No JavaScript ────────────────────────────────────────────────────────
 * Sections paint their own background from `[data-theme-section]` in
 * themes.css, so the page is correct at first paint and correct forever if
 * this module never loads. Only the header's colour tracking needs JS.
 */

type Theme = "1" | "2" | "3";

export function initScrollTheme(): void {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-theme-section]"),
  );
  if (!sections.length) return;

  const root = document.documentElement;
  const live = new Set<HTMLElement>();

  /**
   * More than one section can straddle the mid-line during a fast fling, so
   * pick the one whose own centre is nearest to it rather than trusting
   * callback order.
   */
  function settle(): void {
    if (!live.size) return;
    const mid = window.innerHeight / 2;
    let best: HTMLElement | null = null;
    let bestDist = Infinity;

    for (const el of live) {
      const r = el.getBoundingClientRect();
      const dist = Math.abs((r.top + r.bottom) / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = el;
      }
    }

    const next = best?.dataset.themeSection as Theme | undefined;
    if (next && root.dataset.theme !== next) root.dataset.theme = next;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) live.add(el);
        else live.delete(el);
      }
      settle();
    },
    // A zero-height line across the middle of the viewport.
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
  );

  sections.forEach((el) => io.observe(el));

  // First paint: adopt whichever section already owns the mid-line, so the
  // header is the right colour before the visitor scrolls at all.
  const mid = window.innerHeight / 2;
  for (const el of sections) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) {
      root.dataset.theme = el.dataset.themeSection as Theme;
      break;
    }
  }
}
