/**
 * Word-by-word heading reveal — motion inventory #1.
 *
 * BelArosa does this with GSAP SplitText + ScrollTrigger: each word becomes an
 * inline-block, then animates `opacity 0 -> 1` and `translateY(75%) -> 0` on a
 * stagger, triggered at `start: "top bottom-=100"`.
 *
 * We rebuild it in vanilla for ~1 KB instead of GSAP's 98 KB, because the
 * redesign brief's own rule is a lean brochure site. The easing and the timing
 * are the same values; only the engine differs. If a side-by-side review shows
 * the reveal is not faithful, GSAP core + ScrollTrigger is the documented
 * fallback and this file is what it replaces.
 *
 * ── Reduced motion is built FIRST, not patched ───────────────────────────
 * Under `prefers-reduced-motion: reduce` the DOM is never split at all. The
 * heading keeps its original single text node and renders immediately. There
 * is no split-then-reset path, so there is no frame where a word is invisible.
 *
 * ── Accessibility ────────────────────────────────────────────────────────
 * Splitting a heading into inline-blocks makes some screen readers pause
 * between the pieces, so the original string is copied onto `aria-label`
 * before the split. The accessible name is therefore identical to what it was
 * before this ran. Only headings whose entire content is ONE text node are
 * split; anything with nested markup falls back to a whole-element fade, which
 * cannot damage its structure.
 */

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Matches the reference exactly, read off its GSAP config on 2026-09-04:
 * `stagger: 0.035, duration: 1, ease: "circ.out", delay: 0.3`.
 * The duration, easing and base delay live in CSS (--dur-reveal,
 * --ease-reveal, .rv-i transition-delay); only the per-word step is here.
 */
const STAGGER_MS = 35;

/** The reference's `delay: 0.3` — the whole line waits, then the words step. */
const BASE_DELAY_MS = 300;

function splitOne(el: HTMLElement): boolean {
  const child = el.firstChild;
  const single = el.childNodes.length === 1 && child?.nodeType === Node.TEXT_NODE;
  if (!single) return false;

  const text = (child.textContent ?? "").trim();
  if (!text) return false;

  // The accessible name must survive the split.
  if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", text);

  const frag = document.createDocumentFragment();
  text.split(/\s+/).forEach((word, i) => {
    // Outer clips; inner slides up out of the clip. Two elements, like the
    // reference — one alone cannot both mask and move.
    const mask = document.createElement("span");
    mask.className = "rv-w";
    const inner = document.createElement("span");
    inner.className = "rv-i";
    inner.style.transitionDelay = `${BASE_DELAY_MS + i * STAGGER_MS}ms`;
    inner.textContent = word;
    mask.append(inner);
    frag.append(mask);
    frag.append(document.createTextNode(" "));
  });

  el.replaceChildren(frag);
  el.setAttribute("data-split", "");
  return true;
}

export function initWordReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal-words]");
  if (!targets.length) return;

  // Guard at construction. Nothing is split, nothing is observed.
  if (window.matchMedia(REDUCE_QUERY).matches) {
    targets.forEach((el) => el.setAttribute("data-revealed", ""));
    return;
  }

  targets.forEach((el) => {
    if (!splitOne(el)) el.setAttribute("data-reveal-fade", "");
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        io.unobserve(entry.target); // once. It never replays.
      }
    },
    // The reference fires at `top bottom-=100`: the element's top reaching
    // 100px above the fold. Shrinking the root's bottom edge by 100px is the
    // same trip line.
    { rootMargin: "0px 0px -100px 0px", threshold: 0 },
  );

  targets.forEach((el) => io.observe(el));
}
