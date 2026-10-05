/**
 * scroll.ts
 * Phase 6 — Lenis smooth scroll initialization.
 *
 * Responsibilities:
 *  1. Initialize Lenis with restrained, premium configuration.
 *  2. Run the Lenis RAF loop.
 *  3. Handle anchor-link navigation cleanly with Lenis.
 *  4. Disable Lenis on touch/reduced-motion environments.
 *  5. Export a getLenis() accessor for other modules that need the instance.
 */

import Lenis from 'lenis';

const REDUCED_MOTION  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH_DEVICE = window.matchMedia('(hover: none), (pointer: coarse)').matches;

let lenisInstance: Lenis | null = null;

/** Returns the active Lenis instance, or null if not initialized. */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

function initSkipLinkFocus(): void {
  const skipLink = document.querySelector<HTMLAnchorElement>('.skip-link[href^="#"]');
  if (!skipLink) return;

  skipLink.addEventListener('click', () => {
    const targetId = skipLink.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector<HTMLElement>(targetId);
    if (!target) return;
    requestAnimationFrame(() => target.focus());
  });
}

/** Initialize Lenis and wire up its RAF loop + anchor navigation. */
export function initScroll(): void {
  initSkipLinkFocus();

  // Reduced-motion and touch: skip Lenis, let native scroll handle it.
  if (REDUCED_MOTION || IS_TOUCH_DEVICE) return;

  lenisInstance = new Lenis({
    duration: 1.05,           // Controlled, not floaty.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // RAF loop — drives Lenis on every frame.
  function raf(time: number): void {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor-link fix: stop Lenis momentarily so native anchor resolution
  // can set the correct position, then re-enable smooth scroll.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      // Preserve native skip-link behavior for keyboard users.
      if (anchor.classList.contains('skip-link')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();
      lenisInstance?.scrollTo(target, { offset: -80, duration: 1.0 });
    });
  });
}
