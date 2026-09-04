/**
 * Scroll-linked transforms — motion inventory #8 (image parallax) and #9
 * (grow on scroll). This is the effect the owner asked for by name:
 * "the images get larger, it slides with the images and the text stays".
 *
 * ── What was measured, not guessed ───────────────────────────────────────
 * Read off belarosa-chalet.ch at runtime on 2026-09-04, by sampling computed
 * transforms across a real scroll:
 *
 *   .image-parallax_target        translateY  +10% -> -10%, scale fixed at 1
 *   .chalet-slider-gallery_..._target  scale  0.8 -> 1.0   (0.800/0.900/0.950
 *                                     recorded as it rose up the viewport)
 *
 * The reference drives these with Webflow IX2, not GSAP — its 18 ScrollTriggers
 * carry no `pin` and no `scrub`. But IX2's "scrolling in view" IS a linear
 * scrub, so `scrub: true` with `ease: "none"` is the faithful GSAP spelling of
 * the same mapping.
 *
 * The third leg of the effect — "the text stays" — is not here. It is
 * `position: sticky` in TeaserModule.astro, which is layout, not motion, and so
 * survives `prefers-reduced-motion` untouched.
 *
 * ── Why GSAP and not hand-rolled ─────────────────────────────────────────
 * Owner's call, 2026-09-04, having been shown the ~34 KB gzipped cost against a
 * ~2 KB vanilla equivalent. ScrollTrigger earns it on the parts that are
 * genuinely fiddly by hand: refresh on resize and font-load, velocity-aware
 * scrub, and correct start/end resolution against a smooth-scroll engine.
 *
 * It is loaded DYNAMICALLY and only when there is something to animate, so:
 *   - a reduced-motion visitor never downloads it,
 *   - a page with no [data-fx] never downloads it,
 *   - and it lands in its own chunk, off the critical path.
 *
 * Nothing here is load-bearing for legibility. If the chunk never arrives, the
 * parallax target sits at translateY(0) and the scale target at scale(1), which
 * is exactly what the CSS already paints. No heading and no image is ever
 * hidden waiting on this file — that is why the word reveals stayed on CSS
 * transitions rather than moving to GSAP with everything else.
 */

import type Lenis from "lenis";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Measured off the reference: the image travels +10% to -10% of the CLIPPING
 * WINDOW's height.
 *
 * GSAP's yPercent is a percentage of the moving element's own height, and our
 * target is deliberately oversized (see TeaserModule.astro: `inset: -10% 0`,
 * i.e. 120% tall) so the slide never exposes an edge. So the window percentage
 * has to be divided by that oversize before it becomes a yPercent, or the image
 * travels 12% and clips.
 */
const PARALLAX_WINDOW_PCT = 10;
const TARGET_OVERSIZE = 1.2;
const PARALLAX_FROM = PARALLAX_WINDOW_PCT / TARGET_OVERSIZE; // 8.333…
const PARALLAX_TO = -PARALLAX_FROM;

/** Measured off the reference. */
const SCALE_FROM = 0.8;
const SCALE_TO = 1;

/**
 * Under 560px a full ±10% translate on a short image reads as a glitch rather
 * than as depth, so the travel halves. The reference has no phone equivalent of
 * this module to copy — it stacks and drops the effect entirely — so this is
 * our call, not theirs.
 */
const NARROW = 560;

/**
 * `releaseRaf` is passed in rather than imported, so this file and motion.ts do
 * not form an import cycle.
 */
export async function initScrollFx(
  lenis: Lenis | null,
  releaseRaf: () => void,
): Promise<void> {
  // Guard at construction, like every other initialiser in motion.ts. Under
  // reduce nothing is imported, nothing is registered, no ticker starts.
  if (window.matchMedia(REDUCE_QUERY).matches) return;

  const parallax = document.querySelectorAll<HTMLElement>('[data-fx="parallax"]');
  const scale = document.querySelectorAll<HTMLElement>('[data-fx="scale"]');
  if (!parallax.length && !scale.length) return;

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------------------- */
  /* Hand the clock to GSAP                                                  */
  /*                                                                         */
  /* Two rAF loops reading the same scroll position drift by up to a frame,   */
  /* which shows up as the parallax lagging the page under a fast fling. The  */
  /* reference solves it the same way: Lenis stops running its own loop and   */
  /* becomes a tick inside GSAP's, and ScrollTrigger updates from Lenis's own */
  /* scroll event rather than the native one.                                 */
  /*                                                                         */
  /* lagSmoothing(0) is required. Without it GSAP silently swallows any frame */
  /* over 500ms, and a scrubbed transform jumps instead of catching up.        */
  /* ---------------------------------------------------------------------- */
  if (lenis) {
    releaseRaf(); // motion.ts stops driving it
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const narrow = () => window.matchMedia(`(max-width: ${NARROW - 1}px)`).matches;

  /* ---------------------------------------------------------------------- */
  /* #8 · Parallax — the image slides inside a window that clips it          */
  /*                                                                         */
  /* The trigger is the WINDOW, not the target: the target is 120% tall and   */
  /* offset -10% (see TeaserModule.astro), so its own box would resolve       */
  /* start/end 10% early at each edge.                                        */
  /* ---------------------------------------------------------------------- */
  parallax.forEach((target) => {
    const window_ = target.parentElement;
    if (!window_) return;

    gsap.fromTo(
      target,
      { yPercent: () => (narrow() ? PARALLAX_FROM / 2 : PARALLAX_FROM) },
      {
        yPercent: () => (narrow() ? PARALLAX_TO / 2 : PARALLAX_TO),
        ease: "none", // a scrub is a straight line. Any ease here is a bug.
        scrollTrigger: {
          trigger: window_,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true, // re-read the narrow() branch on resize
        },
      },
    );
  });

  /* ---------------------------------------------------------------------- */
  /* #9 · Grow — 0.8 to 1.0 as the block comes up the screen                 */
  /*                                                                         */
  /* `end: "top center"` lands it at full size when its top reaches the       */
  /* middle of the viewport, then holds. Running the growth across the whole  */
  /* pass instead would still be scaling as it leaves the top, which reads as */
  /* drift rather than arrival.                                               */
  /* ---------------------------------------------------------------------- */
  scale.forEach((el) => {
    gsap.fromTo(
      el,
      { scale: SCALE_FROM },
      {
        scale: SCALE_TO,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "top center",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  /* Fonts land after first paint and change every measurement above. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
