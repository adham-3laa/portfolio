/**
 * spine.ts
 * Phase 6 — Spine opacity fade based on scroll depth.
 *
 * The vertical spine starts at full opacity and gradually becomes
 * more ghostly the further the user scrolls — reinforcing the sense
 * of narrative depth descending through the page.
 *
 * Rules:
 *  - Passive scroll listener, rAF-gated.
 *  - Animate only opacity via CSS custom property injection.
 *  - No layout-thrashing.
 *  - Reduced-motion: skip; spine stays at resting opacity.
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Opacity range: full at hero, ghostly at bottom of page.
const OPACITY_START = 1.0;
const OPACITY_END   = 0.18;

export function initSpineScroll(): void {
  const spine = document.querySelector<HTMLElement>('.site-spine');
  if (!spine || REDUCED_MOTION) return;

  let ticking = false;

  const update = (): void => {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    // Normalized 0 → 1 across total scroll range.
    const progress = Math.min(1, scrollY / docHeight);

    // Linear interpolation between start and end opacity.
    const opacity = OPACITY_START + (OPACITY_END - OPACITY_START) * progress;
    spine.style.setProperty('--spine-scroll-opacity', opacity.toFixed(3));
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
  update(); // Initial state sync.
}
