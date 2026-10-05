/**
 * nav-scroll.ts
 * Phase 6 — Nav frosted-glass transition on scroll.
 *
 * Responsibilities:
 *  1. Track scroll Y.
 *  2. Toggle .site-header--solid on the header once scrolled past hero.
 *  3. Transition is handled by CSS; this module only manages the class.
 *
 * Rules:
 *  - Passive scroll listener.
 *  - requestAnimationFrame-gated reads.
 *  - No layout-thrashing.
 */

const SCROLL_THRESHOLD = 80; // px past hero top before nav transitions.
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initNavScroll(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  if (REDUCED_MOTION) {
    // Reduced motion: keep a stable readable header, no scroll-linked state changes.
    header.classList.add('site-header--solid');
    return;
  }

  let ticking = false;
  let isSolid = false;

  const update = (): void => {
    const scrollY = window.scrollY;
    const shouldBeSolid = scrollY > SCROLL_THRESHOLD;

    if (shouldBeSolid !== isSolid) {
      isSolid = shouldBeSolid;
      header.classList.toggle('site-header--solid', isSolid);
    }
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update(); // Initial check (e.g., after a page reload mid-page).
}
