/**
 * observer.ts
 * Phase 6 — Shared IntersectionObserver utility.
 *
 * Provides one clean, reusable observe() function used by:
 *  - Section reveal triggers
 *  - Word-split title reveals
 *  - Project screenshot reveals
 *  - Feature icon pop reveals
 *
 * Design rules:
 *  - One function, simple API.
 *  - Once-only trigger: unobserves after first intersection.
 *  - Accepts an optional delay override per element.
 *  - Automatically skips for reduced-motion (caller handles display).
 */

export interface ObserveOptions {
  /** IntersectionObserver threshold. Default: 0.12 */
  threshold?: number;
  /** Callback invoked when element enters viewport. */
  onEnter: (el: Element) => void;
  /** Whether to keep observing after first trigger. Default: false */
  persistent?: boolean;
  /** Root margin for the observer. Default: '0px' */
  rootMargin?: string;
}

/**
 * Observe one or more elements. Calls onEnter once when each element
 * enters the viewport at or beyond the given threshold.
 */
export function observe(
  targets: Element | Element[] | NodeListOf<Element>,
  options: ObserveOptions
): IntersectionObserver {
  const {
    threshold = 0.12,
    onEnter,
    persistent = false,
    rootMargin = '0px',
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        if (!persistent) {
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  const list = targets instanceof Element
    ? [targets]
    : Array.from(targets);

  list.forEach((el) => observer.observe(el));

  return observer;
}
