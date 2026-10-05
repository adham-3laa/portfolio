/**
 * projects-motion.ts
 * Phase 6 project motion layer.
 * Phase 7 update: scoped will-change usage and leaner event handling.
 */

import { observe } from './observer';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH_DEVICE = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const IS_SMALL_LAYOUT = window.matchMedia('(max-width: 1024px)').matches;

export function initScreenshotReveal(): void {
  const visuals = document.querySelectorAll<HTMLElement>('.project-showcase__visual');

  visuals.forEach((visual, index) => {
    const frame = visual.querySelector<HTMLElement>('.project-frame');
    if (!frame || REDUCED_MOTION) return;

    const xOffset = IS_SMALL_LAYOUT ? 0 : index % 2 === 0 ? -16 : 16;
    frame.style.willChange = 'opacity, transform';
    frame.style.opacity = '0';
    frame.style.transform = `translateX(${xOffset}px) translateY(24px)`;
    frame.style.transition = '';

    if (!IS_TOUCH_DEVICE && !IS_SMALL_LAYOUT) {
      applyInitial3D(visual, index);
    }

    observe(visual, {
      threshold: 0.12,
      onEnter: () => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            frame.style.transition =
              'opacity 0.72s cubic-bezier(0.25,0,0,1), transform 0.72s cubic-bezier(0.25,0,0,1)';
            frame.style.opacity = '1';
            frame.style.transform = 'translateX(0) translateY(0)';

            const onTransitionEnd = (): void => {
              frame.style.willChange = 'auto';
            };

            frame.addEventListener('transitionend', onTransitionEnd, { once: true });
          })
        );
      },
    });
  });
}

function applyInitial3D(visual: HTMLElement, index: number): void {
  const direction = index % 2 === 0 ? 1 : -1;
  visual.style.perspective = '1400px';
  visual.style.perspectiveOrigin = '50% 50%';
  visual.dataset.tiltDir = String(direction);
}

export function initScreenshotTilt(): void {
  if (REDUCED_MOTION || IS_TOUCH_DEVICE || IS_SMALL_LAYOUT) return;

  const visuals = Array.from(document.querySelectorAll<HTMLElement>('.project-showcase__visual'));
  if (!visuals.length) return;

  const trackedFrames = new Set<HTMLElement>();
  let ticking = false;
  let clearHintsTimer = 0;

  visuals.forEach((visual) => {
    const frame = visual.querySelector<HTMLElement>('.project-frame');
    if (!frame) return;
    frame.style.transition = 'transform 0.12s linear';
  });

  const scheduleHintCleanup = (): void => {
    window.clearTimeout(clearHintsTimer);
    clearHintsTimer = window.setTimeout(() => {
      trackedFrames.forEach((frame) => {
        frame.style.willChange = 'auto';
      });
      trackedFrames.clear();
    }, 180);
  };

  const updateTilts = (): void => {
    const viewportHeight = window.innerHeight;

    visuals.forEach((visual) => {
      const frame = visual.querySelector<HTMLElement>('.project-frame');
      if (!frame) return;

      const direction = Number.parseInt(visual.dataset.tiltDir ?? '1', 10);
      const rect = visual.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const normalized = (center - viewportHeight / 2) / (viewportHeight / 2);

      const rotateY = clamp(normalized * 5 * direction, -7, 7);
      const rotateX = clamp(normalized * 1.5, -2.5, 2.5);

      frame.style.willChange = 'transform';
      frame.style.transform = `rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;
      trackedFrames.add(frame);
    });

    scheduleHintCleanup();
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      updateTilts();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateTilts();
}

export function initCtaBorderDraw(): void {
  const ctas = Array.from(document.querySelectorAll<HTMLElement>('.cta'));
  if (!ctas.length) return;

  const sizeUpdaters: Array<() => void> = [];

  ctas.forEach((cta) => {
    cta.classList.add('cta--border-draw');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'cta__border-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'cta__border-rect');
    rect.setAttribute('x', '0.5');
    rect.setAttribute('y', '0.5');
    rect.setAttribute('rx', '1');
    rect.setAttribute('ry', '1');

    svg.appendChild(rect);
    cta.appendChild(svg);

    const sizeRect = (): void => {
      const { width, height } = cta.getBoundingClientRect();
      if (!width || !height) return;

      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      rect.setAttribute('width', String(width - 1));
      rect.setAttribute('height', String(height - 1));

      const perimeter = 2 * (width + height);
      rect.style.strokeDasharray = String(perimeter);
      rect.style.strokeDashoffset = String(perimeter);
      cta.style.setProperty('--border-perimeter', String(perimeter));
    };

    sizeRect();
    sizeUpdaters.push(sizeRect);
  });

  let resizeRaf = 0;
  window.addEventListener(
    'resize',
    () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        sizeUpdaters.forEach((update) => update());
      });
    },
    { passive: true }
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
