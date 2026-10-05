/**
 * reveal.ts
 * Phase 6 — Section reveal, word-split title reveals, feature icon pops.
 *
 * Responsibilities:
 *  1. Apply section reveal animations across the site.
 *  2. Word-split section title reveals (overflow-hidden wrapper technique).
 *  3. Feature icon pop-stagger reveal for project feature rows.
 *
 * Rules:
 *  - transform + opacity only — no layout-thrashing properties.
 *  - Reduced-motion: content is instantly visible, no animation.
 *  - Uses the shared observe() utility from observer.ts.
 */

import { observe } from './observer';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Utility ──────────────────────────────────────────────────────────────────

function setInitialHidden(el: HTMLElement, translateY = 28): void {
  el.style.opacity = '0';
  el.style.transform = `translateY(${translateY}px)`;
  el.style.transition = '';
}

function revealElement(el: HTMLElement, delay = 0): void {
  const run = (): void => {
    el.style.transition =
      `opacity 0.62s cubic-bezier(0.25,0,0,1) ${delay}ms,` +
      `transform 0.62s cubic-bezier(0.25,0,0,1) ${delay}ms`;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  };

  if (delay > 0) {
    setTimeout(run, 0); // next tick so transition is registered
  } else {
    // rAF ensures the browser has painted the hidden state first.
    requestAnimationFrame(() => requestAnimationFrame(run));
  }
}

// ─── 1. Section reveals ───────────────────────────────────────────────────────

/**
 * Applies a staggered reveal to direct children of each section's
 * .container that match the reveal targets.
 */
export function initSectionReveals(): void {
  const sections = document.querySelectorAll<HTMLElement>('.section');

  sections.forEach((section) => {
    if (section.id === 'hero') return; // Hero has its own intro sequence.

    const container = section.querySelector<HTMLElement>('.container');
    if (!container) return;

    // Select first-level block children to stagger.
    const revealTargets = Array.from(
      container.querySelectorAll<HTMLElement>(
        ':scope > *, .project-showcase > *, .training-block > *, .cert-block'
      )
    ).filter((el) => !el.classList.contains('section__label'));

    if (REDUCED_MOTION) return; // Content is already visible — nothing to do.

    revealTargets.forEach((el) => setInitialHidden(el, 22));

    observe(section, {
      threshold: 0.06,
      onEnter: () => {
        revealTargets.forEach((el, i) => {
          revealElement(el, i * 80);
        });
      },
    });
  });
}

// ─── 2. Word-split title reveals ──────────────────────────────────────────────

/**
 * Splits .section__title elements into word-spans wrapped by
 * overflow-hidden containers, then reveals each word on scroll.
 * Hero heading is handled by hero.ts and is excluded.
 */
export function initTitleReveals(): void {
  const titles = document.querySelectorAll<HTMLElement>(
    '.section__title:not(#hero .section__title):not(.hero__name)'
  );

  titles.forEach((titleEl) => {
    const originalText = titleEl.textContent?.trim() ?? '';
    if (!originalText) return;

    // Preserve accessible text.
    titleEl.setAttribute('aria-label', originalText);

    const words = originalText.split(/\s+/).filter(Boolean);
    titleEl.textContent = '';

    const wordEls: HTMLElement[] = words.map((word, i) => {
      // Outer: clips the word from below (overflow-hidden).
      const clipper = document.createElement('span');
      clipper.className = 'title-word-clip';
      clipper.setAttribute('aria-hidden', 'true');

      // Inner: the translatable word element.
      const inner = document.createElement('span');
      inner.className = 'title-word-inner';
      inner.textContent = word + (i < words.length - 1 ? '\u00a0' : '');

      if (!REDUCED_MOTION) {
        inner.style.display = 'block';
        inner.style.opacity = '0';
        inner.style.transform = 'translateY(100%)';
        inner.style.transition = '';
      }

      clipper.appendChild(inner);
      titleEl.appendChild(clipper);
      return inner;
    });

    if (REDUCED_MOTION) return;

    // Observe the title element — reveal words when it enters view.
    observe(titleEl, {
      threshold: 0.2,
      onEnter: () => {
        wordEls.forEach((inner, i) => {
          const delay = i * 90;
          setTimeout(() => {
            inner.style.transition =
              `opacity 0.55s cubic-bezier(0.25,0,0,1),` +
              `transform 0.55s cubic-bezier(0.25,0,0,1)`;
            inner.style.opacity = '1';
            inner.style.transform = 'translateY(0)';
          }, delay);
        });
      },
    });
  });
}

// ─── 3. Feature icon pop reveals ──────────────────────────────────────────────

/**
 * Applies a subtle staggered scale+opacity reveal to .feature-row elements
 * within project sections — the "pop" on scroll.
 */
export function initFeatureIconReveals(): void {
  const featureLists = document.querySelectorAll<HTMLElement>('.feature-list');

  featureLists.forEach((list) => {
    const rows = Array.from(list.querySelectorAll<HTMLElement>('.feature-row'));
    if (!rows.length) return;

    if (REDUCED_MOTION) return;

    rows.forEach((row) => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(14px)';
      row.style.transition = '';
    });

    // Also set initial hidden state for icons to get the pop effect.
    const icons = Array.from(list.querySelectorAll<HTMLElement>('.feature-row__icon'));
    icons.forEach((icon) => {
      icon.style.transform = 'scale(0.72)';
      icon.style.transition = '';
    });

    observe(list, {
      threshold: 0.1,
      onEnter: () => {
        rows.forEach((row, i) => {
          const delay = i * 90;
          setTimeout(() => {
            row.style.transition =
              `opacity 0.5s cubic-bezier(0.25,0,0,1) ${delay}ms,` +
              `transform 0.5s cubic-bezier(0.25,0,0,1) ${delay}ms`;
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, 0);

          // Icon: pop with a mild spring easing — the ONLY place spring is used.
          const icon = icons[i];
          if (icon) {
            setTimeout(() => {
              icon.style.transition =
                `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`;
              icon.style.transform = 'scale(1)';
            }, 0);
          }
        });
      },
    });
  });
}
